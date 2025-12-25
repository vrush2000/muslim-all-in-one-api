import { Hono } from 'hono';
import { query as dbQuery, get as dbGet } from '../../../database/config.js';

const murotal = new Hono();

murotal.get('/qari', async (c) => {
  try {
    const data = await dbQuery("SELECT * FROM qari ORDER BY id ASC");
    return c.json({
      status: 200,
      data: data
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

murotal.get('/', async (c) => {
  try {
    const qariId = c.req.query('qariId') || '05'; // Default to Misyari Rasyid
    const surahId = c.req.query('surahId');

    // Get Qari Info
    const qari = await dbGet("SELECT * FROM qari WHERE id = ?", [qariId]);

    if (surahId) {
      const data = await dbQuery("SELECT number, name_id, name_short, audio_full FROM surah WHERE number = ?", [surahId]);
      if (data.length === 0) {
        return c.json({ status: 404, message: 'Surah not found' }, 404);
      }
      
      const surah = data[0];
      const audioFull = JSON.parse(surah.audio_full || '{}');
      
      return c.json({
        status: 200,
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
    const allSurahs = await dbQuery("SELECT number, name_id, name_short, audio_full FROM surah ORDER BY CAST(number as INTEGER) ASC");
    
    const result = allSurahs.map(s => {
      const audioFull = JSON.parse(s.audio_full || '{}');
      return {
        surahId: s.number,
        name: s.name_id,
        name_short: s.name_short,
        audio_url: audioFull[qariId] || null
      };
    });

    return c.json({
      status: 200,
      qari: qari || { id: qariId, name: 'Unknown' },
      data: result
    });

  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default murotal;
