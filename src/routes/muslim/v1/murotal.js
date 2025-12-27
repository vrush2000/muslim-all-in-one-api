import { Hono } from 'hono';
import { getQari, getSurahList } from '../../../utils/jsonHandler.js';

const murotal = new Hono();

murotal.get('/qari', async (c) => {
  try {
    const data = await getQari();
    if (!data) return c.json({ status: false, message: 'Daftar qari tidak tersedia.', data: [] }, 404);
    
    return c.json({
      status: true,
      message: 'Berhasil mendapatkan daftar qari.',
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar qari: ' + error.message }, 500);
  }
});

murotal.get('/', async (c) => {
  try {
    const qariId = c.req.query('qariId') || '05'; // Default to Misyari Rasyid
    const surahId = c.req.query('surahId');

    // Get Qari Info
    const allQari = await getQari();
    const qari = allQari ? allQari.find(q => q.id == qariId) : null;

    if (surahId) {
      const allSurahs = await getSurahList();
      const surah = allSurahs ? allSurahs.find(s => s.number == surahId) : null;
      
      if (!surah) {
        return c.json({ status: false, message: 'Surah tidak ditemukan.' }, 404);
      }
      
      const audioFull = typeof surah.audio_full === 'string' ? JSON.parse(surah.audio_full || '{}') : (surah.audio_full || {});
      
      return c.json({
        status: true,
        message: `Berhasil mendapatkan murotal surah ${surah.name_id} untuk qari ${qari ? qari.name : qariId}.`,
        data: {
          surahId: surah.number,
          name: surah.name_id,
          name_short: surah.name_short,
          qariId: qariId,
          audio_url: audioFull[qariId] || null
        }
      });
    }

    // If no surahId, return all surahs with audio for that qari
    const allSurahs = await getSurahList();
    if (!allSurahs) return c.json({ status: false, message: 'Daftar surah tidak tersedia.', data: [] }, 404);
    
    const result = allSurahs.sort((a, b) => parseInt(a.number) - parseInt(b.number)).map(s => {
      const audioFull = typeof s.audio_full === 'string' ? JSON.parse(s.audio_full || '{}') : (s.audio_full || {});
      return {
        surahId: s.number,
        name: s.name_id,
        name_short: s.name_short,
        audio_url: audioFull[qariId] || null
      };
    });

    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar murotal untuk qari ${qari ? qari.name : qariId}.`,
      qari: qari || { id: qariId, name: 'Unknown' },
      data: result
    });

  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data murotal: ' + error.message }, 500);
  }
});

export default murotal;
