import { Hono } from 'hono';
import { API_CONFIG } from '../../../config.js';

const sholat = new Hono();

const BASE_API = API_CONFIG.SHOLAT.MYQURAN;

// Cache untuk daftar kota agar tidak sering fetch
let kotaCache = null;

// Endpoint: Semua Kota
sholat.get('/kota/semua', async (c) => {
  try {
    if (kotaCache) return c.json({ status: 200, data: kotaCache });

    const response = await fetch(`${BASE_API}/kota/semua`);
    const data = await response.json();
    
    if (data.status) {
      kotaCache = data.data;
      return c.json({ status: 200, data: data.data });
    }
    return c.json({ status: 500, message: 'Gagal mengambil data kota' }, 500);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// Endpoint: Cari Kota
sholat.get('/kota/cari', async (c) => {
  const query = c.req.query('nama');
  if (!query) return c.json({ status: 400, message: 'Parameter nama diperlukan' }, 400);

  try {
    const response = await fetch(`${BASE_API}/kota/cari/${query}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// Endpoint: Jadwal Sholat by Kota ID
sholat.get('/jadwal', async (c) => {
  const kotaId = c.req.query('kotaId');
  const tanggal = c.req.query('tanggal') || new Date().toISOString().split('T')[0];
  
  if (!kotaId) return c.json({ status: 400, message: 'Parameter kotaId diperlukan' }, 400);

  try {
    const response = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// Endpoint: Jadwal Sholat by Koordinat (Lat, Lon)
sholat.get('/jadwal/koordinat', async (c) => {
  const lat = c.req.query('lat');
  const lon = c.req.query('lon');
  const tanggal = c.req.query('tanggal') || new Date().toISOString().split('T')[0];

  if (!lat || !lon) {
    return c.json({ status: 400, message: 'Parameter lat dan lon diperlukan' }, 400);
  }

  try {
    // 1. Reverse Geocode menggunakan Nominatim untuk mendapatkan nama kota
    const geoRes = await fetch(`${API_CONFIG.SHOLAT.NOMINATIM}?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { 'User-Agent': 'Muslim-API/1.0' }
    });
    const geoData = await geoRes.json();
    
    // Ambil nama kota/kabupaten
    const city = geoData.address.city || geoData.address.town || geoData.address.municipality || geoData.address.county;
    
    if (!city) {
      return c.json({ status: 404, message: 'Lokasi tidak ditemukan' }, 404);
    }

    // 2. Cari ID Kota di MyQuran berdasarkan nama kota
    const cleanCityName = city.replace(/Kota |Kabupaten /g, '').trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();

    if (!kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({ 
        status: 404, 
        message: `Kota ${cleanCityName} tidak terdaftar di database Kemenag`,
        location: city 
      }, 404);
    }

    // Gunakan hasil pertama
    const kotaId = kotaData.data[0].id;
    
    // 3. Ambil Jadwal Sholat
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const jadwalData = await jadwalRes.json();

    return c.json({
      status: 200,
      location: geoData.display_name,
      city_found: city,
      data: jadwalData.data
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default sholat;
