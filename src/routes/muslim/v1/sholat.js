import { Hono } from 'hono';
import { API_CONFIG } from '../../../config.js';

const sholat = new Hono();

const BASE_API = API_CONFIG.SHOLAT.MYQURAN;

// Cache untuk daftar kota agar tidak sering fetch
let kotaCache = null;

// Endpoint: Semua Kota
sholat.get('/kota/semua', async (c) => {
  try {
    if (kotaCache) return c.json({ status: true, message: 'Berhasil mendapatkan daftar kota (dari cache).', data: kotaCache });

    const response = await fetch(`${BASE_API}/kota/semua`);
    const data = await response.json();
    
    if (data.status) {
      kotaCache = data.data;
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar kota.', data: data.data });
    }
    return c.json({ status: false, message: 'Gagal mengambil data kota dari API sumber.' }, 502);
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar kota: ' + error.message }, 500);
  }
});

// Endpoint: Cari Kota
sholat.get('/kota/cari', async (c) => {
  const query = c.req.query('nama');
  if (!query) return c.json({ status: false, message: 'Parameter nama diperlukan.' }, 400);

  try {
    const response = await fetch(`${BASE_API}/kota/cari/${query}`);
    const data = await response.json();

    if (!response.ok || !data.status) {
      return c.json({
        status: false,
        message: `Gagal mencari kota dengan kata kunci: ${query} dari API sumber.`,
        error: data.message || 'Unknown error'
      }, response.status || 502);
    }

    if (!data.data || data.data.length === 0) {
      return c.json({
        status: false,
        message: `Tidak ada kota yang ditemukan dengan kata kunci: ${query}.`,
        data: []
      }, 404);
    }

    return c.json({
      status: true,
      message: `Berhasil mencari kota dengan kata kunci: ${query}.`,
      data: data.data || []
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari kota: ' + error.message }, 500);
  }
});

// Endpoint: Jadwal Sholat by Kota ID
sholat.get('/jadwal', async (c) => {
  const kotaId = c.req.query('kotaId');
  const tanggal = c.req.query('tanggal') || new Date().toISOString().split('T')[0];
  
  if (!kotaId) return c.json({ status: false, message: 'Parameter kotaId diperlukan.' }, 400);

  try {
    const response = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await response.json();

    if (!response.ok || !data.status) {
      return c.json({
        status: false,
        message: `Gagal mengambil jadwal sholat untuk kota ID ${kotaId} dari API sumber.`,
        error: data.message || 'Unknown error'
      }, response.status || 502);
    }

    return c.json({
      status: true,
      message: `Berhasil mendapatkan jadwal sholat untuk kota ID ${kotaId} pada tanggal ${tanggal}.`,
      data: data.data ? data.data.jadwal : null
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan jadwal sholat: ' + error.message }, 500);
  }
});

// Endpoint: Jadwal Sholat by Koordinat (Lat, Lon)
sholat.get('/jadwal/koordinat', async (c) => {
  const lat = c.req.query('lat');
  const lon = c.req.query('lon');
  const tanggal = c.req.query('tanggal') || new Date().toISOString().split('T')[0];

  if (!lat || !lon) {
    return c.json({ status: false, message: 'Parameter lat dan lon diperlukan.' }, 400);
  }

  try {
    // 1. Reverse Geocode menggunakan Nominatim untuk mendapatkan nama kota
    const geoRes = await fetch(`${API_CONFIG.SHOLAT.NOMINATIM}?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { 'User-Agent': 'Muslim-API/1.0' }
    });
    
    if (!geoRes.ok) {
      return c.json({ status: false, message: 'Gagal mendapatkan data lokasi dari Nominatim.' }, 502);
    }
    
    const geoData = await geoRes.json();
    
    // Ambil nama kota/kabupaten
    const address = geoData.address || {};
    const city = address.city || address.town || address.municipality || address.county;
    
    if (!city) {
      return c.json({ status: false, message: 'Lokasi tidak ditemukan.' }, 404);
    }

    // 2. Cari ID Kota di MyQuran berdasarkan nama kota
    const cleanCityName = city.replace(/Kota Adm. |Kota |Kabupaten |Kab. /g, '').trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();

    if (!kotaRes.ok || !kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({ 
        status: false, 
        message: `Kota ${cleanCityName} tidak ditemukan dalam daftar wilayah Kemenag.`,
        location: city 
      }, 404);
    }

    // Gunakan hasil pertama
    const kotaId = kotaData.data[0].id;
    
    // 3. Ambil Jadwal Sholat
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await jadwalRes.json();
    
    if (!jadwalRes.ok || !data.status) {
      return c.json({ status: false, message: 'Gagal mengambil jadwal dari API sumber.' }, 502);
    }

    return c.json({
      status: true,
      message: `Berhasil mendapatkan jadwal sholat untuk lokasi ${city} (${lat}, ${lon}).`,
      data: {
        location: city,
        coordinates: { lat, lon },
        jadwal: data.data ? data.data.jadwal : null
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan jadwal sholat berdasarkan koordinat: ' + error.message }, 500);
  }
});

// Endpoint: Waktu Sholat Terdekat
sholat.get('/next', async (c) => {
  const lat = c.req.query('lat');
  const lon = c.req.query('lon');
  
  if (!lat || !lon) {
    return c.json({ status: false, message: 'Parameter lat dan lon diperlukan.' }, 400);
  }

  try {
    // 1. Dapatkan Jadwal Hari Ini (reuse logika koordinat)
    const today = new Date().toISOString().split('T')[0];
    const cityRes = await fetch(`${API_CONFIG.SHOLAT.NOMINATIM}?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { 'User-Agent': 'Muslim-API/1.0' }
    });

    if (!cityRes.ok) {
      return c.json({ status: false, message: 'Gagal mendapatkan data lokasi dari Nominatim.' }, 502);
    }

    const geoData = await cityRes.json();
    const address = geoData.address || {};
    const city = address.city || address.town || address.municipality || address.county;
    
    if (!city) {
      return c.json({ status: false, message: 'Lokasi tidak ditemukan.' }, 404);
    }

    const cleanCityName = city.replace(/Kota Adm. |Kota |Kabupaten |Kab. /g, '').trim();
    
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();

    if (!kotaRes.ok || !kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({ status: false, message: `Kota ${cleanCityName} tidak terdaftar.` }, 404);
    }

    const kotaId = kotaData.data[0].id;

    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${today}`);
    const jadwalData = await jadwalRes.json();
    
    if (!jadwalRes.ok || !jadwalData.status) return c.json({ status: false, message: 'Gagal mengambil jadwal dari API sumber.' }, 502);

    const jadwal = jadwalData.data.jadwal;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const times = [
      { name: 'Imsak', time: jadwal.imsak },
      { name: 'Subuh', time: jadwal.subuh },
      { name: 'Terbit', time: jadwal.terbit },
      { name: 'Dhuha', time: jadwal.dhuha },
      { name: 'Dzuhur', time: jadwal.dzuhur },
      { name: 'Ashar', time: jadwal.ashar },
      { name: 'Maghrib', time: jadwal.maghrib },
      { name: 'Isya', time: jadwal.isya }
    ];

    let nextPrayer = null;
    for (const t of times) {
      const [h, m] = t.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      
      if (prayerMinutes > currentTime) {
        const diff = prayerMinutes - currentTime;
        nextPrayer = {
          name: t.name,
          time: t.time,
          remaining_minutes: diff,
          remaining_hours: Math.floor(diff / 60),
          remaining_minutes_only: diff % 60
        };
        break;
      }
    }

    // Jika sudah lewat Isya, ambil Subuh besok
    if (!nextPrayer) {
      nextPrayer = { name: 'Subuh (Besok)', time: times[1].time, message: 'Waktu Isya telah lewat' };
    }

    return c.json({
      status: true,
      message: 'Waktu sholat terdekat berhasil didapatkan.',
      data: {
        current_time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        next_prayer: nextPrayer,
        location: city,
        jadwal_today: jadwal
      }
    });

  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan waktu sholat terdekat: ' + error.message }, 500);
  }
});

export default sholat;
