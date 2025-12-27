import { Hono } from 'hono';
import { getMasjid } from '../../../utils/jsonHandler.js';
import { API_CONFIG } from '../../../config.js';

const kemenag = new Hono();

// Helper for Haversine distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

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
    
    const allMasjid = await getMasjid();
    if (!allMasjid) return c.json({ status: false, message: 'Daftar masjid tidak tersedia.', data: [] }, 404);

    let data = allMasjid;

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(m => 
        (m.nama && m.nama.toLowerCase().includes(searchLower)) || 
        (m.deskripsi && m.deskripsi.toLowerCase().includes(searchLower))
      );
    }
    if (lokasi) {
      const lokasiLower = lokasi.toLowerCase();
      data = data.filter(m => m.lokasi && m.lokasi.toLowerCase().includes(lokasiLower));
    }
    if (jenis) {
      data = data.filter(m => m.jenis === jenis);
    }
    if (tipologi) {
      data = data.filter(m => m.tipologi === tipologi);
    }

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
    const allMasjid = await getMasjid();
    const data = allMasjid ? allMasjid.find(m => m.id == id) : null;
    
    if (!data) {
      return c.json({ status: false, message: 'Masjid tidak ditemukan.', data: {} }, 404);
    }
    return c.json({ status: true, message: 'Berhasil mendapatkan detail masjid.', data: data });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail masjid: ' + error.message }, 500);
  }
});

kemenag.get('/masjid/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const allMasjid = await getMasjid();
    const data = allMasjid ? allMasjid.find(m => m.id == id) : null;

    if (!data) {
      return c.json({ status: false, message: "Masjid tidak ditemukan.", data: {} }, 404);
    }

    return c.json({
      status: true,
      message: 'Berhasil mendapatkan detail masjid.',
      data: data
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

    const allMasjid = await getMasjid();
    if (!allMasjid) return c.json({ status: false, message: 'Daftar masjid tidak tersedia.', data: [] }, 404);

    // Calculate distance and filter
    const data = allMasjid
      .map(m => {
        const distance = getDistance(lat, lng, parseFloat(m.latitude), parseFloat(m.longitude));
        return { ...m, distance };
      })
      .filter(m => m.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

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
