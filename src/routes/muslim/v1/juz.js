import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const juz = new Hono();

juz.get('/', async (c) => {
  try {
    const juzId = c.req.query('juzId') || c.req.query('id');
    if (juzId != null) {
      const data = await get("SELECT * FROM juz WHERE number = ?", [juzId]);
      if (!data) {
        return c.json({ status: false, message: 'Juz tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail juz.', data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM juz ORDER BY CAST (number as INTEGER) ASC");
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh juz.', data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data juz: ' + error.message }, 500);
  }
});

export default juz;
