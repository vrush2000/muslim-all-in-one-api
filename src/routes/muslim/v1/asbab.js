import { Hono } from 'hono';
import { getAsbabNuzul } from '../../../utils/jsonHandler.js';

const asbab = new Hono();

asbab.get('/', async (c) => {
  try {
    const id = c.req.query('asbabId') || c.req.query('id');
    const allAsbab = await getAsbabNuzul();
    if (!allAsbab) return c.json({ status: false, message: 'Daftar Asbabun Nuzul tidak tersedia.', data: [] }, 404);

    if (id == null) {
      const sortedData = [...allAsbab].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar Asbabun Nuzul.', data: sortedData });
    } else {
      const data = allAsbab.find(a => a.id == id);
      if (!data) {
        return c.json({ status: false, message: 'Asbabun Nuzul tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail Asbabun Nuzul.', data: data });
      }
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data Asbabun Nuzul: ' + error.message }, 500);
  }
});

export default asbab;
