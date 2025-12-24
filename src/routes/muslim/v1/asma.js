import { Hono } from 'hono';
import { query } from '../../../database/config.js';

const asma = new Hono();

asma.get('/', async (c) => {
  try {
    const id = c.req.query('asmaId') || c.req.query('id');
    if (id != null) {
      const data = await query("SELECT * FROM asmaul_husna WHERE id = ?", [id]);
      if (!data || data.length === 0) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data[0] });
      }
    } else {
      const data = await query("SELECT * FROM asmaul_husna ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: 404, data: [] }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default asma;
