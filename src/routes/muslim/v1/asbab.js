import { Hono } from 'hono';
import { get, query } from '../../../database/config.js';

const asbab = new Hono();

asbab.get('/', async (c) => {
  try {
    const id = c.req.query('asbabId') || c.req.query('id');
    if (id == null) {
      const data = await query("SELECT * FROM asbab_nuzul ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: 404, data: [] }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    } else {
      const data = await get("SELECT * FROM asbab_nuzul WHERE id = ?", [id]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default asbab;
