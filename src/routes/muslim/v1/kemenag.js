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
      year: year,
      data: mappedData
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// Data Pesantren (Source: https://github.com/nasrul21/data-pesantren-indonesia)
kemenag.get('/provinsi', async (c) => {
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/provinsi.json`);
    if (!response.ok) return c.json({ status: false, message: 'Gagal mengambil data provinsi' }, response.status);
    const data = await response.json();
    return c.json({ status: true, data });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

kemenag.get('/kabupaten', async (c) => {
  const provinsiId = c.req.query('provinsiId');
  if (!provinsiId) return c.json({ status: false, message: 'provinsiId is required' }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/kabupaten/${provinsiId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Gagal mengambil data kabupaten untuk provinsi ID ${provinsiId}` }, response.status);
    const data = await response.json();
    return c.json({ status: true, data });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

kemenag.get('/pesantren', async (c) => {
  const kabupatenId = c.req.query('kabupatenId');
  if (!kabupatenId) return c.json({ status: false, message: 'kabupatenId is required' }, 400);
  try {
    const response = await fetch(`${API_CONFIG.KEMENAG.PESANTREN}/pesantren/${kabupatenId}.json`);
    if (!response.ok) return c.json({ status: false, message: `Data pesantren untuk kabupaten ID ${kabupatenId} tidak ditemukan` }, response.status);
    const data = await response.json();
    return c.json({ status: true, data });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

// Data Masjid (Now from Database)
kemenag.get('/masjid', async (c) => {
  try {
    const data = await dbQuery("SELECT * FROM masjid");
    return c.json({
      status: true,
      data: data
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default kemenag;
