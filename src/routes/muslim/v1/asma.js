import { Hono } from 'hono';
import { query } from '../../../database/config.js';

const asma = new Hono();

asma.get('/', async (c) => {
  try {
    const id = c.req.query('asmaId') || c.req.query('id');
    if (id != null) {
      const data = await query("SELECT * FROM asmaul_husna WHERE id = ?", [id]);
      if (!data || data.length === 0) {
        return c.json({ status: false, message: 'Asmaul Husna tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail Asmaul Husna.', data: data[0] });
      }
    } else {
      const data = await query("SELECT * FROM asmaul_husna ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: false, message: 'Daftar Asmaul Husna tidak tersedia.', data: [] }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan daftar Asmaul Husna.', data: data });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data Asmaul Husna: ' + error.message }, 500);
  }
});

export default asma;
