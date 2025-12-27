import { Hono } from 'hono';
import { getDzikir } from '../../../utils/jsonHandler.js';

const dzikir = new Hono();

dzikir.get('/', async (c) => {
  try {
    const type = c.req.query('type');
    const allDzikir = await getDzikir();
    if (!allDzikir) return c.json({ status: false, message: 'Daftar dzikir tidak tersedia.', data: [] }, 404);

    if (type != null) {
      const data = allDzikir.filter(d => d.type === type);
      return c.json({ status: true, message: `Berhasil mendapatkan dzikir tipe: ${type}.`, data });
    } else {
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar dzikir.', data: allDzikir });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data dzikir: ' + error.message }, 500);
  }
});

export default dzikir;
