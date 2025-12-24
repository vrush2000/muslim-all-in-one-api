import { Hono } from 'hono';
import { query as dbQuery } from '../../../database/config.js';

const dzikir = new Hono();

dzikir.get('/', async (c) => {
  try {
    const type = c.req.query('type');
    if (type != null) {
      const data = await dbQuery(
        "SELECT * FROM dzikir WHERE type = ?",
        [type]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      const data = await dbQuery("SELECT * FROM dzikir");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default dzikir;
