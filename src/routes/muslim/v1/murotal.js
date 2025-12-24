import { Hono } from 'hono';
import { query } from '../../../database/config.js';

const murotal = new Hono();

const qaris = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul-Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman as-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi' },
  { id: '06', name: 'Yasser Al-Dosari' }
];

murotal.get('/qari', (c) => {
  return c.json({
    status: 200,
    data: qaris
  });
});

murotal.get('/', async (c) => {
  try {
    const qariId = c.req.query('qariId') || '05'; // Default to Misyari Rasyid
    const surahId = c.req.query('surahId');

    if (surahId) {
      const data = await query("SELECT number, name_id, name_short, audio_full FROM surah WHERE number = ?", [surahId]);
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
    const allSurahs = await query("SELECT number, name_id, name_short, audio_full FROM surah ORDER BY CAST(number as INTEGER) ASC");
    
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
      qari: qaris.find(q => q.id === qariId) || { id: qariId, name: 'Unknown' },
      data: result
    });

  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default murotal;
