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
      message: kategori ? `Berhasil mendapatkan daftar sejarah kategori ${kategori}.` : 'Berhasil mendapatkan seluruh daftar sejarah.',
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar sejarah: ' + error.message }, 500);
  }
});

// Get Sejarah Detail
sejarah.get('/detail', async (c) => {
  try {
    const id = c.req.query('id');
    if (!id) return c.json({ status: false, message: 'Parameter id diperlukan.' }, 400);

    const item = await dbGet("SELECT * FROM sejarah WHERE id = ?", [id]);
    
    if (!item) return c.json({ status: false, message: 'Data sejarah tidak ditemukan.', data: {} }, 404);
    
    return c.json({ status: true, message: 'Berhasil mendapatkan detail sejarah.', data: item });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail sejarah: ' + error.message }, 500);
  }
});

// Get Sejarah Today (On This Day)
sejarah.get('/today', async (c) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = monthNames[today.getMonth()];
    
    // Cari peristiwa yang mengandung tanggal atau bulan hari ini di kolom 'tahun'
    // Contoh: "17 Ramadhan", "12 Rabiul Awwal", "632 M", dll.
    // Karena format tahun kita beragam, kita gunakan LIKE
    const data = await dbQuery(`
      SELECT * FROM sejarah 
      WHERE tahun LIKE ? OR tahun LIKE ? OR deskripsi LIKE ?
      LIMIT 10
    `, [`%${day} ${month}%`, `%${month}%`, `%${day} ${month}%`]);

    return c.json({
      status: true,
      message: `Berhasil mendapatkan peristiwa sejarah untuk hari ini (${day} ${month}).`,
      data: {
        events: data,
        today: `${day} ${month}`
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan peristiwa sejarah hari ini: ' + error.message }, 500);
  }
});

export default sejarah;
