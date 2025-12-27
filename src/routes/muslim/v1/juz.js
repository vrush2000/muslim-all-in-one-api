import { Hono } from 'hono';
import { getJuz } from '../../../utils/jsonHandler.js';

const juz = new Hono();

juz.get('/', async (c) => {
  try {
    const juzId = c.req.query('juzId') || c.req.query('id');
    const allJuz = await getJuz();
    if (!allJuz) return c.json({ status: false, message: 'Daftar juz tidak tersedia.', data: [] }, 404);

    if (juzId != null) {
      const data = allJuz.find(j => j.number == juzId);
      if (!data) {
        return c.json({ status: false, message: 'Juz tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail juz.', data: data });
      }
    } else {
      const sortedData = [...allJuz].sort((a, b) => parseInt(a.number) - parseInt(b.number));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh juz.', data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data juz: ' + error.message }, 500);
  }
});

export default juz;
