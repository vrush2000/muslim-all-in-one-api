import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const theme = new Hono();

theme.get('/', async (c) => {
  try {
    const themeId = c.req.query('themeId') || c.req.query('id');
    if (themeId != null) {
      const data = await get("SELECT * FROM theme WHERE id = ?", [themeId]);
      if (!data) {
        return c.json({ status: false, message: 'Tema tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail tema.', data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM theme ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh tema.', data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data tema: ' + error.message }, 500);
  }
});

export default theme;
