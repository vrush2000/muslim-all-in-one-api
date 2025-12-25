import { Hono } from 'hono';
import { query as dbQuery } from '../../../database/config.js';
import { API_CONFIG } from '../../../config.js';

const kemenag = new Hono();

// Data Hari Libur Nasional (Source: https://github.com/kresnasatya/api-harilibur)
kemenag.get('/libur', async (c) => {
  const year = c.req.query('year') || new Date().getFullYear().toString();
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.HARI_LIBUR}?year=${year}`);
    if (!response.ok) {
      return c.json({ status: false, message: `Data libur tahun ${year} tidak ditemukan` }, 404);
    }
    const data = await response.json();
    
    // Map data to maintain consistent internal format
    const mappedData = data.map(item => ({
      tanggal: item.holiday_date,
      keterangan: item.holiday_name,
      is_cuti: !item.is_national_holiday
    }));

    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hari libur tahun ${year}.`,
      data: {
        year: year,
        holidays: mappedData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data libur: ' + error.message }, 500);
  }
});

// Data Pesantren (Source: https://github.com/nasrul21/data-pesantren-indonesia)
kemenag.get('/provinsi', async (c) => {
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/provinsi.json`);
    if (!response.ok) return c.json({ status: false, message: 'Gagal mengambil data provinsi.' }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: 'Berhasil mendapatkan daftar provinsi.', data });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data provinsi: ' + error.message }, 500);
  }
});

kemenag.get('/kabupaten', async (c) => {
  const provinsiId = c.req.query('provinsiId');
  if (!provinsiId) return c.json({ status: false, message: 'Parameter provinsiId diperlukan.' }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/kabupaten/${provinsiId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Gagal mengambil data kabupaten untuk provinsi ID ${provinsiId}.` }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: `Berhasil mendapatkan daftar kabupaten untuk provinsi ${provinsiId}.`, data });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data kabupaten: ' + error.message }, 500);
  }
});

kemenag.get('/pesantren', async (c) => {
  const kabupatenId = c.req.query('kabupatenId');
  if (!kabupatenId) return c.json({ status: false, message: 'Parameter kabupatenId diperlukan.' }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/pesantren/${kabupatenId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Data pesantren untuk kabupaten ID ${kabupatenId} tidak ditemukan.` }, response.status);
    const data = await response.json();
    return c.json({ status: true, message: `Berhasil mendapatkan daftar pesantren untuk kabupaten ${kabupatenId}.`, data });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data pesantren: ' + error.message }, 500);
  }
});

// Data Masjid (Source: SIMAS Kemenag)
kemenag.get('/masjid', async (c) => {
  try {
    const search = c.req.query('search');
    const lokasi = c.req.query('lokasi');
    const jenis = c.req.query('jenis'); // Masjid, Mushalla
    const tipologi = c.req.query('tipologi'); // Nasional, Raya, Agung, Besar, Jami, Bersejarah, Publik, dll
    
    let sql = "SELECT * FROM masjid";
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push("(nama LIKE ? OR deskripsi LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (lokasi) {
      conditions.push("lokasi LIKE ?");
      params.push(`%${lokasi}%`);
    }
    if (jenis) {
      conditions.push("jenis = ?");
      params.push(jenis);
    }
    if (tipologi) {
      conditions.push("tipologi = ?");
      params.push(tipologi);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const data = await dbQuery(sql, params);

    return c.json({
      status: true,
      message: search || lokasi || jenis || tipologi 
        ? `Berhasil mencari masjid dengan kriteria tertentu.` 
        : `Berhasil mendapatkan daftar seluruh masjid.`,
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar masjid: ' + error.message }, 500);
  }
});

// Get Masjid Detail
kemenag.get('/masjid/detail', async (c) => {
  const id = c.req.query('id');
  if (!id) return c.json({ status: false, message: 'Parameter id diperlukan.' }, 400);

  try {
    const data = await dbQuery("SELECT * FROM masjid WHERE id = ?", [id]);
    if (data.length === 0) {
      return c.json({ status: false, message: 'Masjid tidak ditemukan.', data: {} }, 404);
    }
    return c.json({ status: true, message: 'Berhasil mendapatkan detail masjid.', data: data[0] });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail masjid: ' + error.message }, 500);
  }
});

kemenag.get('/masjid/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const sql = "SELECT * FROM masjid WHERE id = ?";
    const data = await dbQuery(sql, [id]);

    if (data.length === 0) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }

    return c.json({
      status: true,
      message: 'Berhasil mendapatkan detail masjid.',
      data: data[0]
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail masjid: ' + error.message }, 500);
  }
});

// Nearby Masjid (Geo-Location)
kemenag.get('/masjid/nearby', async (c) => {
  try {
    const lat = parseFloat(c.req.query('lat'));
    const lng = parseFloat(c.req.query('lng'));
    const radius = parseFloat(c.req.query('radius') || 5); // Default 5km

    if (isNaN(lat) || isNaN(lng)) {
      return c.json({ status: false, message: 'Parameter lat dan lng diperlukan.' }, 400);
    }

    // Menggunakan formula Haversine untuk menghitung jarak di SQLite
    // 6371 adalah radius bumi dalam KM
    // SQLite tidak mendukung HAVING secara langsung untuk alias di beberapa versi, 
    // kita gunakan subquery atau filter manual jika perlu. 
    // Untuk performa, kita gunakan pendekatan bounding box dulu sebelum Haversine.
    
    const data = await dbQuery(`
      SELECT * FROM (
        SELECT *, 
        (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
        FROM masjid
        WHERE latitude BETWEEN ${lat - (radius/111)} AND ${lat + (radius/111)}
        AND longitude BETWEEN ${lng - (radius/(111 * Math.cos(lat * Math.PI/180)))} AND ${lng + (radius/(111 * Math.cos(lat * Math.PI/180)))}
      ) AS t
      WHERE distance <= ${radius}
      ORDER BY distance ASC
      LIMIT 20
    `);

    return c.json({
      status: true,
      message: `Berhasil menemukan masjid dalam radius ${radius}km.`,
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari masjid terdekat: ' + error.message }, 500);
  }
});

export default kemenag;
