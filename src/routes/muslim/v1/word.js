import { Hono } from 'hono';
import { query as dbQuery } from '../../../database/config.js';

const word = new Hono();

word.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const ayahId = c.req.query('ayahId');

    let sql = "SELECT * FROM word";
    let params = [];

    if (surahId != null && ayahId != null) {
      sql += " WHERE surah = ? AND ayah = ?";
      params = [surahId, ayahId];
    } else if (surahId != null) {
      sql += " WHERE surah = ?";
      params = [surahId];
    }

    sql += " ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC";
    
    const data = await dbQuery(sql, params);
    return c.json({ status: true, message: 'Berhasil mendapatkan daftar kata.', data: data || [] });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data kata: ' + error.message }, 500);
  }
});

export default word;
