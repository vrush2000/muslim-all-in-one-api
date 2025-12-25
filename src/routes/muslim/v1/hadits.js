import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';
import { API_CONFIG } from '../../../config.js';

const hadits = new Hono();

const GADING_API_BASE = API_CONFIG.HADITS.GADING;

// Hadits Arbain (Existing)
hadits.get('/', async (c) => {
  try {
    const nomor = c.req.query('nomor');
    if (nomor != null) {
      const data = await get("SELECT * FROM hadits WHERE no = ?", [nomor]);
      if (!data) {
        return c.json({ status: false, message: 'Hadits tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail Hadits Arbain.', data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM hadits ORDER BY CAST(no as INTEGER) ASC");
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar Hadits Arbain.', data: data || [] });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data hadits: ' + error.message }, 500);
  }
});

// List of Hadith Books (from api.hadith.gading.dev)
hadits.get('/books', async (c) => {
  try {
    const response = await fetch(`${GADING_API_BASE}/books`);
    const data = await response.json();

    if (!response.ok || (data.code && data.code !== 200)) {
      return c.json({
        status: false,
        message: 'Gagal mengambil daftar kitab hadits dari API sumber.',
        error: data.message || 'Unknown error'
      }, response.status || 502);
    }

    return c.json({
      status: true,
      message: 'Berhasil mendapatkan daftar kitab hadits.',
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar kitab hadits: ' + error.message }, 500);
  }
});

// Hadiths by Book with Range (from api.hadith.gading.dev)
hadits.get('/books/:name', async (c) => {
  try {
    const name = c.req.param('name');
    const range = c.req.query('range');
    const url = range 
      ? `${GADING_API_BASE}/books/${name}?range=${range}`
      : `${GADING_API_BASE}/books/${name}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || (data.code && data.code !== 200)) {
      return c.json({
        status: false,
        message: `Gagal mengambil daftar hadits dari kitab ${name} dari API sumber.`,
        error: data.message || 'Unknown error'
      }, response.status || 502);
    }

    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hadits dari kitab ${name}.`,
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: `Gagal mendapatkan daftar hadits dari kitab ${c.req.param('name')}: ` + error.message }, 500);
  }
});

// Specific Hadith by Number (from api.hadith.gading.dev)
hadits.get('/books/:name/:number', async (c) => {
  try {
    const name = c.req.param('name');
    const number = c.req.param('number');
    
    const response = await fetch(`${GADING_API_BASE}/books/${name}/${number}`);
    const data = await response.json();

    if (!response.ok || (data.code && data.code !== 200)) {
      return c.json({
        status: false,
        message: `Gagal mengambil detail hadits nomor ${number} dari kitab ${name} dari API sumber.`,
        error: data.message || 'Unknown error'
      }, response.status || 502);
    }

    return c.json({
      status: true,
      message: `Berhasil mendapatkan detail hadits nomor ${number} dari kitab ${name}.`,
      data: data.data || data
    });
  } catch (error) {
    return c.json({ status: false, message: `Gagal mendapatkan detail hadits dari kitab ${c.req.param('name')}: ` + error.message }, 500);
  }
});

hadits.get('/find', async (c) => {
  try {
    const q = c.req.query('query');
    if (q != null) {
      const data = await dbQuery(
        "SELECT * FROM hadits WHERE judul LIKE ? ORDER BY CAST(no as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: true, message: `Berhasil mencari hadits dengan kata kunci: ${q}.`, data: data || [] });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari hadits: ' + error.message }, 500);
  }
});

export default hadits;
