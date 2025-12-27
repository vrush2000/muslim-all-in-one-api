import { Hono } from 'hono';
import { getAyahBySurah, getSurahList, updateAnalytics } from '../../../utils/jsonHandler.js';

const ayah = new Hono();

const formatAyah = (a) => {
  if (!a) return a;
  return {
    ...a,
    audio_partial: typeof a.audio_partial === 'string' ? JSON.parse(a.audio_partial) : (a.audio_partial || {})
  };
};

ayah.get('/', async (c) => {
  try {
    const surahList = await getSurahList();
    let allAyahs = [];
    for (const s of surahList) {
      const ayahs = await getAyahBySurah(s.number);
      if (ayahs) allAyahs.push(...ayahs);
    }
    return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh ayat.', data: allAyahs.map(formatAyah) });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar ayat: ' + error.message }, 500);
  }
});

ayah.get('/range', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const start = parseInt(c.req.query('start'));
    const end = parseInt(c.req.query('end'));
    
    if (surahId != null && !isNaN(start) && !isNaN(end)) {
      const ayahs = await getAyahBySurah(surahId);
      if (!ayahs) {
        return c.json({ status: false, message: 'Surah tidak ditemukan.' }, 404);
      }
      const data = ayahs.filter(a => {
        const num = parseInt(a.ayah);
        return num >= start && num <= end;
      });
      return c.json({ status: true, message: `Berhasil mendapatkan ayat dari surah ${surahId} rentang ${start}-${end}.`, data: data.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId, start, end).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan rentang ayat: ' + error.message }, 500);
  }
});

ayah.get('/surah', async (c) => {
  try {
    const id = c.req.query('surahId') || c.req.query('id');
    if (id != null) {
      const data = await getAyahBySurah(id);
      if (!data) {
        return c.json({ status: false, message: `Surah ${id} tidak ditemukan.`, data: [] }, 404);
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk surah ${id}.`, data: data.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan ayat surah: ' + error.message }, 500);
  }
});

ayah.get('/juz', async (c) => {
  try {
    const id = c.req.query('juzId') || c.req.query('id');
    if (id != null) {
      const surahList = await getSurahList();
      let juzAyahs = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter(a => a.juz == id);
          juzAyahs.push(...filtered);
        }
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk juz ${id}.`, data: juzAyahs.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (juzId).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan ayat juz: ' + error.message }, 500);
  }
});

ayah.get('/page', async (c) => {
  try {
    const id = c.req.query('page') || c.req.query('id');
    if (id != null) {
      const surahList = await getSurahList();
      let pageAyahs = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter(a => a.page == id);
          pageAyahs.push(...filtered);
        }
      }
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk halaman ${id}.`, data: pageAyahs.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (page).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

ayah.get('/specific', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const ayahId = c.req.query('ayahId');
    if (surahId != null && ayahId != null) {
      const ayahs = await getAyahBySurah(surahId);
      if (!ayahs) {
        return c.json({ status: false, message: `Surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      }
      
      const data = ayahs.find(a => a.ayah == ayahId);
      if (!data) {
        return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      } else {
        const formatted = formatAyah(data);
        // Tambahkan link verifikasi eksternal ke Kemenag RI
        formatted.external_verification = `https://quran.kemenag.go.id/quran/per-ayat/surah/${surahId}?from=${ayahId}&to=${ayahId}`;
        
        // Track ayah read analytics
        updateAnalytics('ayah', `${surahId}:${ayahId}`).catch(err => console.error('Analytics error:', err));
        
        return c.json({ status: true, message: `Berhasil mendapatkan detail ayat ${ayahId} pada surah ${surahId}.`, data: formatted });
      }
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId, ayahId).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail ayat: ' + error.message }, 500);
  }
});

ayah.get('/find', async (c) => {
  try {
    const q = c.req.query('query');
    if (q != null && q.length > 3) {
      const surahList = await getSurahList();
      let results = [];
      const queryLower = q.toLowerCase();

      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const matched = ayahs.filter(a => a.text && a.text.toLowerCase().includes(queryLower));
          results.push(...matched);
        }
        // Batasi hasil pencarian agar tidak terlalu berat
        if (results.length >= 100) break;
      }
      
      if (results.length === 0) {
        return c.json({ 
          status: false, 
          message: `Tidak ada ayat yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }

      return c.json({ status: true, message: `Berhasil mencari ayat dengan kata kunci: ${q}.`, data: results.map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query). Harus lebih dari 3 karakter.",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari ayat: ' + error.message }, 500);
  }
});

export default ayah;
