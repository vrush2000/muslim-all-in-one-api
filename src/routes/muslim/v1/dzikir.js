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
      return c.json({ status: true, message: `Berhasil mendapatkan dzikir tipe: ${type}.`, data: data || [] });
    } else {
      const data = await dbQuery("SELECT * FROM dzikir");
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar dzikir.', data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data dzikir: ' + error.message }, 500);
  }
});

export default dzikir;
