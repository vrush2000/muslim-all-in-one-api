import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const ayah = new Hono();

const formatAyah = (a) => {
  return {
    ...a,
    audio_partial: a.audio_partial ? JSON.parse(a.audio_partial) : {}
  };
};

ayah.get('/', async (c) => {
  try {
    const data = await dbQuery("SELECT * FROM ayah ORDER BY CAST(id as INTEGER) ASC");
    return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh ayat.', data: (data || []).map(formatAyah) });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar ayat: ' + error.message }, 500);
  }
});

ayah.get('/range', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const start = c.req.query('start');
    const end = c.req.query('end');
    if (surahId != null && start != null && end != null) {
      const data = await dbQuery(
        "SELECT * FROM ayah WHERE surah = ? AND ayah BETWEEN CAST(? as INTEGER) and CAST(? as INTEGER) ORDER BY CAST(id as INTEGER) ASC",
        [surahId, start, end]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan ayat dari surah ${surahId} rentang ${start}-${end}.`, data: (data || []).map(formatAyah) });
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
      const data = await dbQuery(
        "SELECT * FROM ayah WHERE surah = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk surah ${id}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (surahId).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan ayat juz: ' + error.message }, 500);
  }
});

ayah.get('/juz', async (c) => {
  try {
    const id = c.req.query('juzId') || c.req.query('id');
    if (id != null) {
      const data = await dbQuery(
        "SELECT * FROM ayah WHERE juz = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk juz ${id}.`, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (juzId).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan ayat halaman: ' + error.message }, 500);
  }
});

ayah.get('/page', async (c) => {
  try {
    const id = c.req.query('page') || c.req.query('id');
    if (id != null) {
      const data = await dbQuery(
        "SELECT * FROM ayah WHERE page = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: true, message: `Berhasil mendapatkan daftar ayat untuk halaman ${id}.`, data: (data || []).map(formatAyah) });
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
      const data = await get(
        "SELECT * FROM ayah WHERE surah = ? AND ayah = ?",
        [surahId, ayahId]
      );
      if (!data) {
        return c.json({ status: false, message: `Ayat ${ayahId} pada surah ${surahId} tidak ditemukan.`, data: {} }, 404);
      } else {
        return c.json({ status: true, message: `Berhasil mendapatkan detail ayat ${ayahId} pada surah ${surahId}.`, data: formatAyah(data) });
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
      const data = await dbQuery(
        "SELECT * FROM ayah WHERE text LIKE ? ORDER BY CAST(id as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: true, message: `Berhasil mencari ayat dengan kata kunci: ${q}.`, data: (data || []).map(formatAyah) });
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
