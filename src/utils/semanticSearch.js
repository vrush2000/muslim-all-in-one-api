const normalizeText = (value) => {
  if (value == null) return '';
  return String(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const aLen = a.length;
  const bLen = b.length;

  const prev = new Array(bLen + 1);
  const curr = new Array(bLen + 1);

  for (let j = 0; j <= bLen; j++) prev[j] = j;

  for (let i = 1; i <= aLen; i++) {
    curr[0] = i;
    const aCh = a.charCodeAt(i - 1);
    for (let j = 1; j <= bLen; j++) {
      const cost = aCh === b.charCodeAt(j - 1) ? 0 : 1;
      const del = prev[j] + 1;
      const ins = curr[j - 1] + 1;
      const sub = prev[j - 1] + cost;
      curr[j] = Math.min(del, ins, sub);
    }
    for (let j = 0; j <= bLen; j++) prev[j] = curr[j];
  }

  return prev[bLen];
};

const tokenSimilarity = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  if (a.includes(b) || b.includes(a)) {
    const shorter = Math.min(a.length, b.length);
    const longer = Math.max(a.length, b.length);
    return Math.min(0.9, shorter / longer);
  }
  const dist = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
};

const STOPWORDS = new Set([
  'doa', 'dan', 'atau', 'yang', 'di', 'ke', 'dari', 'pada', 'untuk', 'dengan',
  'saat', 'ketika', 'agar', 'supaya', 'sebelum', 'sesudah', 'setelah', 'adalah',
  'itu', 'ini', 'kami', 'kita', 'saya', 'aku', 'engkau', 'kamu', 'dia', 'mereka'
]);

const TOKEN_MAP = {
  mesjid: 'masjid',
  masid: 'masjid',
  mushola: 'mushalla',
  musholla: 'mushalla',
  mushollaah: 'mushalla',
  sholat: 'shalat',
  solat: 'shalat',
  wudhu: 'wudu',
  wudlu: 'wudu',
  puasa: 'shaum',
  ramadhan: 'ramadan',
  arofah: 'arafah',
  dzulhijjah: 'zulhijjah',
  muharom: 'muharram',
  shubuh: 'subuh',
  dhuhur: 'zuhur',
  dzuhur: 'zuhur',
  ashar: 'asar',
  maghrib: 'magrib',
  isya: 'isya'
};

const normalizeToken = (token) => {
  const t = normalizeText(token);
  if (!t) return '';
  return TOKEN_MAP[t] || t;
};

const tokenize = (text) => {
  return normalizeText(text)
    .split(' ')
    .map(normalizeToken)
    .filter(Boolean);
};

/**
 * Perform semantic search on a list of items.
 * @param {Array} items - List of items to search.
 * @param {string} query - The search query.
 * @param {Object} options - Search options.
 * @param {Array<string>} options.fields - Fields to search in.
 * @param {Array<string>} options.boostFields - Fields to boost score (e.g. title).
 * @param {number} options.limit - Max results to return.
 * @returns {Array} - Filtered and sorted items.
 */
export const semanticSearch = (items, query, options = {}) => {
  const {
    fields = ['judul', 'indo'],
    boostFields = ['judul', 'nama'],
    limit = 50
  } = options;

  if (!query || !items || items.length === 0) return [];

  const normalizedQuery = normalizeText(query);
  const rawTokens = tokenize(query);
  const queryTokens = rawTokens.filter(t => !STOPWORDS.has(t));
  const finalQueryTokens = queryTokens.length > 0 ? queryTokens : rawTokens;

  const scored = items.map((item) => {
    const searchableTexts = fields.map(f => item[f] || '').join(' ');
    const haystack = normalizeText(searchableTexts);
    const docTokens = tokenize(searchableTexts);

    let sumSim = 0;
    let matched = 0;
    let maxSim = 0;

    for (const qt of finalQueryTokens) {
      let best = 0;
      for (const dt of docTokens) {
        const s = tokenSimilarity(qt, dt);
        if (s > best) best = s;
        if (best >= 0.95) break;
      }
      if (best > maxSim) maxSim = best;
      if (best >= 0.78) matched += 1;
      sumSim += best;
    }

    const coverage = finalQueryTokens.length > 0 ? matched / finalQueryTokens.length : 0;
    const avgSim = sumSim / Math.max(1, finalQueryTokens.length);

    const hasPhrase = Boolean(normalizedQuery && haystack.includes(normalizedQuery));
    
    let hasBoostPhrase = false;
    for (const bf of boostFields) {
      const bfText = normalizeText(item[bf] || '');
      if (normalizedQuery && bfText.includes(normalizedQuery)) {
        hasBoostPhrase = true;
        break;
      }
    }

    const hasStrongToken = maxSim >= 0.86;

    let score = avgSim + coverage * 0.7;
    if (hasPhrase) score += 1.2;
    if (hasBoostPhrase) score += 0.8;

    return { item, score, avgSim, coverage, hasPhrase, hasBoostPhrase, hasStrongToken };
  });

  const filtered = scored
    .filter(r => {
      if (finalQueryTokens.length <= 1) {
        if (!(r.hasPhrase || r.hasBoostPhrase || r.hasStrongToken)) return false;
        if (r.hasPhrase || r.hasBoostPhrase) return true;
        return r.avgSim >= 0.82;
      }
      if (r.hasPhrase || r.hasBoostPhrase) return r.avgSim >= 0.55;
      return r.coverage >= 0.6 && r.avgSim >= 0.62;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);

  return filtered;
};
