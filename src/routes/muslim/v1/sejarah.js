import { Hono } from 'hono';
import { query as dbQuery, get as dbGet } from '../../../database/config.js';

const sejarah = new Hono();

// Get Sejarah List
sejarah.get('/', async (c) => {
  try {
    const kategori = c.req.query('kategori');
    let sql = "SELECT * FROM sejarah";
    let params = [];

    if (kategori) {
      sql += " WHERE kategori LIKE ?";
      params.push(`%${kategori}%`);
    }

    const data = await dbQuery(sql, params);

    return c.json({
      status: true,
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// Get Sejarah Detail
sejarah.get('/detail', async (c) => {
  try {
    const id = c.req.query('id');
    if (!id) return c.json({ status: false, message: 'ID is required' }, 400);

    const item = await dbGet("SELECT * FROM sejarah WHERE id = ?", [id]);
    
    if (!item) return c.json({ status: false, message: 'Data tidak ditemukan' }, 404);
    
    return c.json({ status: true, data: item });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// Get Tanya Jawab / Fatwa
sejarah.get('/tanya-jawab', async (c) => {
  try {
    const data = await dbQuery("SELECT * FROM fatwa");
    return c.json({
      status: true,
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default sejarah;
