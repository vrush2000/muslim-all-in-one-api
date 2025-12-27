import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbQuery, dbGet, dbAll } from './db.js';

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

export async function getPuasa() {
  return await readJson('common/puasa.json');
}

export async function getFiqhPuasa() {
  return await readJson('common/fiqh_puasa.json');
}

export async function getAnalytics() {
  try {
    const totalReads = await dbGet("SELECT value FROM global_stats WHERE key = 'total_reads'");
    const globalKhatam = await dbGet("SELECT value FROM global_stats WHERE key = 'global_khatam'");
    const lastUpdated = await dbGet("SELECT last_updated FROM global_stats WHERE key = 'total_reads'");

    const trendingSurahs = await dbAll("SELECT item_id, count FROM item_stats WHERE type = 'surah'");
    const trendingAyahs = await dbAll("SELECT item_id, count FROM item_stats WHERE type = 'ayah'");

    const surahMap = {};
    trendingSurahs.forEach(row => surahMap[row.item_id] = row.count);

    const ayahMap = {};
    trendingAyahs.forEach(row => ayahMap[row.item_id] = row.count);

    return {
      trending_surahs: surahMap,
      trending_ayahs: ayahMap,
      global_khatam: globalKhatam ? globalKhatam.value : 0,
      total_reads: totalReads ? totalReads.value : 0,
      last_updated: lastUpdated ? lastUpdated.last_updated : new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get analytics from DB:', error);
    return {
      trending_surahs: {},
      trending_ayahs: {},
      global_khatam: 0,
      total_reads: 0,
      last_updated: new Date().toISOString()
    };
  }
}

export async function updateAnalytics(type, id) {
  try {
    if (type === 'surah' || type === 'ayah') {
      await dbQuery(`
        INSERT INTO item_stats (type, item_id, count, last_updated) 
        VALUES (?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(type, item_id) DO UPDATE SET 
          count = count + 1,
          last_updated = CURRENT_TIMESTAMP
      `, [type, id]);

      await dbQuery(`
        UPDATE global_stats 
        SET value = value + 1, last_updated = CURRENT_TIMESTAMP 
        WHERE key = 'total_reads'
      `);
    } else if (type === 'khatam') {
      await dbQuery(`
        UPDATE global_stats 
        SET value = value + 1, last_updated = CURRENT_TIMESTAMP 
        WHERE key = 'global_khatam'
      `);
    }
    return true;
  } catch (error) {
    console.error('Failed to update analytics in DB:', error);
    return false;
  }
}

export async function getLocalHadits(bookName) {
  return await readJson(`hadits/${bookName}.json`);
}
