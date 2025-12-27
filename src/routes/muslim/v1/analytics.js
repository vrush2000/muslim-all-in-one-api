import { Hono } from 'hono';
import { getAnalytics, updateAnalytics, getSurahList } from '../../../utils/jsonHandler.js';

const analytics = new Hono();

// Endpoint: Get Global Spiritual Analytics
analytics.get('/', async (c) => {
  try {
    const stats = await getAnalytics();
    const surahList = await getSurahList();

    // Transform trending surahs into a more readable format
    const trendingSurahs = Object.entries(stats.trending_surahs)
      .map(([id, count]) => {
        const surah = surahList ? surahList.find(s => s.number == id) : null;
        return {
          id,
          name: surah ? surah.name_id : 'Unknown',
          reads: count
        };
      })
      .sort((a, b) => b.reads - a.reads)
      .slice(0, 10);

    return c.json({
      status: true,
      message: "Berhasil mendapatkan statistik spiritual global.",
      data: {
        total_reads: stats.total_reads,
        global_khatam_count: stats.global_khatam,
        trending_surahs: trendingSurahs,
        last_updated: stats.last_updated
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data analitik: ' + error.message }, 500);
  }
});

// Endpoint: Report Khatam (Community Event)
analytics.post('/khatam', async (c) => {
  try {
    const success = await updateAnalytics('khatam');
    if (success) {
      return c.json({ 
        status: true, 
        message: "Alhamdulillah! Satu khatam baru telah tercatat dalam statistik global. Semoga berkah." 
      });
    }
    return c.json({ status: false, message: "Gagal mencatat khatam." }, 500);
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default analytics;
