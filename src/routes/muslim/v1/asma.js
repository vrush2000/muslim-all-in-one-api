import { Hono } from 'hono';
import { getAsmaulHusna } from '../../../utils/jsonHandler.js';

const asma = new Hono();

asma.get('/', async (c) => {
  try {
    const id = c.req.query('asmaId') || c.req.query('id');
    const allAsma = await getAsmaulHusna();
    if (!allAsma) return c.json({ status: false, message: 'Daftar Asmaul Husna tidak tersedia.', data: [] }, 404);

    if (id != null) {
      const data = allAsma.find(a => a.id == id);
      if (!data) {
        return c.json({ status: false, message: 'Asmaul Husna tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail Asmaul Husna.', data });
      }
    } else {
      const sortedData = [...allAsma].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar Asmaul Husna.', data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data Asmaul Husna: ' + error.message }, 500);
  }
});

export default asma;
