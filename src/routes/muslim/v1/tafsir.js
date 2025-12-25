import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const tafsir = new Hono();

tafsir.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    if (surahId != null) {
      const data = await dbQuery("SELECT * FROM tafsir WHERE id = ?", [surahId]);
      if (!data || data.length === 0) {
        return c.json({ status: false, message: 'Tafsir surah tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail tafsir surah.', data: data[0] });
      }
    } else {
      const data = await dbQuery("SELECT * FROM tafsir ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar tafsir surah.', data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data tafsir: ' + error.message }, 500);
  }
});

export default tafsir;
