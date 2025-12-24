import { Hono } from 'hono';
import { query as dbQuery } from '../../../database/config.js';

const doa = new Hono();

doa.get('/', async (c) => {
  try {
    const source = c.req.query('source');
    if (source != null) {
      const data = await dbQuery(
        "SELECT * FROM doa WHERE source = ? ORDER BY judul ASC",
        [source]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      const data = await dbQuery("SELECT * FROM doa ORDER BY judul ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

doa.get('/find', async (c) => {
  try {
    const q = c.req.query('query');
    if (q != null) {
      const data = await dbQuery(
        "SELECT * FROM doa WHERE judul LIKE ? ORDER BY judul ASC",
        [`%${q}%`]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default doa;
