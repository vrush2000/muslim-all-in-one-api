import { Hono } from 'hono';
import { get, query as dbQuery } from '../../../database/config.js';

const hadits = new Hono();

const GADING_API_BASE = 'https://api.hadith.gading.dev';

// Hadits Arbain (Existing)
hadits.get('/', async (c) => {
  try {
    const nomor = c.req.query('nomor');
    if (nomor != null) {
      const data = await get("SELECT * FROM hadits WHERE no = ?", [nomor]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data });
      }
    } else {
      const data = await dbQuery("SELECT * FROM hadits ORDER BY CAST(no as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// List of Hadith Books (from api.hadith.gading.dev)
hadits.get('/books', async (c) => {
  try {
    const response = await fetch(`${GADING_API_BASE}/books`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// Specific Hadith by Number (from api.hadith.gading.dev)
hadits.get('/books/:name/:number', async (c) => {
  try {
    const name = c.req.param('name');
    const number = c.req.param('number');
    
    const response = await fetch(`${GADING_API_BASE}/books/${name}/${number}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
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
      return c.json({ status: 200, data: data || [] });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query).",
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default hadits;
