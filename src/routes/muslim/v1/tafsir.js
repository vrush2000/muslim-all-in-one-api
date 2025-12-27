import { Hono } from 'hono';
import { getTafsir } from '../../../utils/jsonHandler.js';

const tafsir = new Hono();

tafsir.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const allTafsir = await getTafsir();
    if (!allTafsir) return c.json({ status: false, message: 'Daftar tafsir tidak tersedia.', data: [] }, 404);

    if (surahId != null) {
      const data = allTafsir.find(t => t.id == surahId);
      if (!data) {
        return c.json({ status: false, message: 'Tafsir surah tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail tafsir surah.', data: data });
      }
    } else {
      const sortedData = [...allTafsir].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar tafsir surah.', data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data tafsir: ' + error.message }, 500);
  }
});

export default tafsir;
