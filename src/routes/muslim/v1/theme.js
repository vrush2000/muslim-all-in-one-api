import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const theme = new Hono();

theme.get('/', async (c) => {
  try {
    const themeId = c.req.query('themeId') || c.req.query('id');
    if (themeId != null) {
      const data = await get("SELECT * FROM theme WHERE id = ?", [themeId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM theme ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default theme;
