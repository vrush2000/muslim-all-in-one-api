import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_PATH = path.join(process.cwd(), 'src/data');

export async function readJson(filePath) {
  try {
    const fullPath = path.join(DATA_PATH, filePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message);
    return null;
  }
}

export async function writeJson(filePath, data) {
  try {
    const fullPath = path.join(DATA_PATH, filePath);
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing JSON to ${filePath}:`, error.message);
    return false;
  }
}

export async function getSurahList() {
  return await readJson('quran/surah.json');
}

export async function getSurahDetail(number) {
  const surahs = await getSurahList();
  return surahs ? surahs.find(s => s.number == number) : null;
}

export async function getAyahBySurah(surahNumber) {
  return await readJson(`quran/ayah/${surahNumber}.json`);
}

export async function getDoa() {
  return await readJson('common/doa.json');
}

export async function getAsmaulHusna() {
  return await readJson('common/asmaul_husna.json');
}

export async function getDzikir() {
  return await readJson('common/dzikir.json');
}

export async function getHaditsArbain() {
  return await readJson('hadits/arbain.json');
}

export async function getThemes() {
  return await readJson('quran/themes.json');
}

export async function getJuz() {
  return await readJson('quran/juz.json');
}

export async function getTafsir() {
  return await readJson('quran/tafsir.json');
}

export async function getWord() {
  return await readJson('quran/word.json');
}

export async function getAsbabNuzul() {
  return await readJson('quran/asbab_nuzul.json');
}

export async function getSejarah() {
  return await readJson('common/sejarah.json');
}

export async function getQari() {
  return await readJson('common/qari.json');
}

export async function getCalendarMonths() {
  return await readJson('common/calendar_months.json');
}

export async function getCalendarDays() {
  return await readJson('common/calendar_days.json');
}

export async function getMasjid() {
  return await readJson('common/masjid.json');
}

export async function getAnalytics() {
  const data = await readJson('common/analytics.json');
  return data || {
    trending_surahs: {},
    trending_ayahs: {},
    global_khatam: 0,
    total_reads: 0,
    last_updated: new Date().toISOString()
  };
}

export async function updateAnalytics(type, id) {
  const stats = await getAnalytics();
  
  if (type === 'surah') {
    stats.trending_surahs[id] = (stats.trending_surahs[id] || 0) + 1;
    stats.total_reads += 1;
  } else if (type === 'ayah') {
    stats.trending_ayahs[id] = (stats.trending_ayahs[id] || 0) + 1;
    stats.total_reads += 1;
  } else if (type === 'khatam') {
    stats.global_khatam += 1;
  }
  
  stats.last_updated = new Date().toISOString();
  return await writeJson('common/analytics.json', stats);
}

export async function getLocalHadits(bookName) {
  return await readJson(`hadits/${bookName}.json`);
}
