import { Hono } from 'hono';
import { get, query } from '../../../database/config.js';

const surah = new Hono();

const formatSurah = (s) => {
  return {
    ...s,
    audio_full: s.audio_full ? JSON.parse(s.audio_full) : {}
  };
};

surah.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    if (surahId != null) {
      const data = await get("SELECT * FROM surah WHERE number = ?", [surahId]);
      if (!data) {
        return c.json({ status: false, message: 'Surah tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail surah.', data: formatSurah(data) });
      }
    } else {
      const data = await query("SELECT * FROM surah ORDER BY CAST(number as INTEGER) ASC");
      if (!data) {
        return c.json({ status: false, message: 'Daftar surah tidak tersedia.', data: [] }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan daftar surah.', data: data.map(formatSurah) });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data surah: ' + error.message }, 500);
  }
});

export default surah;
