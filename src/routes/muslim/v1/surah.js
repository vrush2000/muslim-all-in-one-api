import { Hono } from 'hono';
import { getSurahList, getSurahDetail, updateAnalytics } from '../../../utils/jsonHandler.js';

const surah = new Hono();

const formatSurah = (s) => {
  if (!s) return s;
  return {
    ...s,
    audio_full: typeof s.audio_full === 'string' ? JSON.parse(s.audio_full) : (s.audio_full || {})
  };
};

surah.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    if (surahId != null) {
      const data = await getSurahDetail(surahId);
      if (!data) {
        return c.json({ status: false, message: 'Surah tidak ditemukan.', data: {} }, 404);
      } else {
        // Track surah read analytics (async, don't wait for it)
        updateAnalytics('surah', surahId).catch(err => console.error('Analytics error:', err));
        
        return c.json({ status: true, message: 'Berhasil mendapatkan detail surah.', data: formatSurah(data) });
      }
    } else {
      const data = await getSurahList();
      if (!data) {
        return c.json({ status: false, message: 'Daftar surah tidak tersedia.', data: [] }, 404);
      } else {
        // Sort by number just in case
        const sortedData = [...data].sort((a, b) => parseInt(a.number) - parseInt(b.number));
        return c.json({ status: true, message: 'Berhasil mendapatkan daftar surah.', data: sortedData.map(formatSurah) });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data surah: ' + error.message }, 500);
  }
});

export default surah;
