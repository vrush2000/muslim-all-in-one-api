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
    return c.json({ status: 200, data: (data || []).map(formatAyah) });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId, start, end).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (juzId).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (page).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: formatAyah(data) });
      }
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId, ayahId).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query). Harus lebih dari 3 karakter.",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default ayah;
