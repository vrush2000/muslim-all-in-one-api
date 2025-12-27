import { Hono } from 'hono';
import { getDoa } from '../../../utils/jsonHandler.js';

const doa = new Hono();

doa.get('/', async (c) => {
  try {
    const source = c.req.query('source');
    const allDoa = await getDoa();
    if (!allDoa) return c.json({ status: false, message: 'Daftar doa tidak tersedia.', data: [] }, 404);

    if (source != null) {
      const data = allDoa.filter(d => d.source === source).sort((a, b) => a.judul.localeCompare(b.judul));
      return c.json({ status: true, message: `Berhasil mendapatkan doa dari sumber: ${source}.`, data });
    } else {
      const data = [...allDoa].sort((a, b) => a.judul.localeCompare(b.judul));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar doa.', data });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data doa: ' + error.message }, 500);
  }
});

doa.get('/find', async (c) => {
  try {
    const q = c.req.query('query');
    if (q != null) {
      const allDoa = await getDoa();
      if (!allDoa) return c.json({ status: false, message: 'Daftar doa tidak tersedia.', data: [] }, 404);

      const queryLower = q.toLowerCase();
      const data = allDoa.filter(d => d.judul.toLowerCase().includes(queryLower))
                        .sort((a, b) => a.judul.localeCompare(b.judul));

      if (data.length === 0) {
        return c.json({ 
          status: false, 
          message: `Tidak ada doa yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }

      return c.json({ status: true, message: `Berhasil mencari doa dengan kata kunci: ${q}.`, data });
    } else {
      return c.json({
        status: false,
        message: "Parameter diperlukan (query).",
      }, 400);
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari doa: ' + error.message }, 500);
  }
});

export default doa;
