import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const tafsir = new Hono();

tafsir.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    if (surahId != null) {
      const data = await dbQuery("SELECT * FROM tafsir WHERE surahId = ?", [surahId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM tafsir ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default tafsir;
