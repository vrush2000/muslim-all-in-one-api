import { Hono } from 'hono';
import { getPuasa, getFiqhPuasa } from '../../../utils/jsonHandler.js';

const puasa = new Hono();

// Get all puasa (sunnah & ramadhan)
puasa.get('/', async (c) => {
  try {
    const data = await getPuasa();
    if (!data) throw new Error('Data puasa tidak tersedia');

    return c.json({
      status: true,
      message: 'Berhasil mengambil daftar puasa.',
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mengambil data puasa: ' + error.message }, 500);
  }
});

// Get Fiqh/Adab Puasa (70 Matters)
puasa.get('/fiqh', async (c) => {
  try {
    const data = await getFiqhPuasa();
    if (!data) throw new Error('Data fiqh puasa tidak tersedia');

    return c.json({
      status: true,
      message: 'Berhasil mengambil 70 Masalah Terkait Puasa (Fiqh & Adab).',
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mengambil data fiqh puasa: ' + error.message }, 500);
  }
});

// Search puasa by name
puasa.get('/find', async (c) => {
  const query = c.req.query('query');
  if (!query) return c.json({ status: false, message: 'Parameter query diperlukan.' }, 400);

  try {
    const data = await getPuasa();
    const filtered = data.filter(p => 
      p.nama.toLowerCase().includes(query.toLowerCase()) || 
      p.deskripsi.toLowerCase().includes(query.toLowerCase())
    );

    return c.json({
      status: true,
      message: `Berhasil mencari puasa dengan query: ${query}`,
      data: filtered
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari data puasa: ' + error.message }, 500);
  }
});

// Get puasa by type (mingguan, bulanan, tahunan)
puasa.get('/type/:type', async (c) => {
  const type = c.req.param('type');
  try {
    const data = await getPuasa();
    const filtered = data.filter(p => p.type === type);

    return c.json({
      status: true,
      message: `Berhasil mengambil daftar puasa tipe: ${type}`,
      data: filtered
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mengambil data puasa: ' + error.message }, 500);
  }
});

export default puasa;
