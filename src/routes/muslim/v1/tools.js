import { Hono } from 'hono';
import { query as dbQuery, get as dbGet } from '../../../database/config.js';

const tools = new Hono();

// Daily Quotes (Ayat/Hadits Hari Ini)
tools.get('/quotes/daily', async (c) => {
  try {
    // Ambil 1 ayat acak
    const ayat = await dbGet(`
      SELECT *
      FROM ayah
      ORDER BY RANDOM() LIMIT 1
    `);
    
    // Ambil data surah
    const surahData = await dbGet(`SELECT * FROM surah WHERE number = ?`, [ayat.surah]);
    const surahName = surahData.name_id || surahData.name_en || surahData.name_long;

    // Ambil 1 hadits acak
    const hadits = await dbGet(`
      SELECT *
      FROM hadits
      ORDER BY RANDOM() LIMIT 1
    `);

    return c.json({
      status: true,
      message: 'Berhasil mengambil kutipan harian.',
      data: {
        ayat: {
          arab: ayat.arab,
          text: ayat.text,
          sumber: `QS. ${surahName}: ${ayat.ayah}`
        },
        hadits: {
          arab: hadits.arab,
          text: hadits.indo,
          sumber: `HR. ${hadits.judul || 'Hadits'}`
        }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mengambil kutipan harian: ' + error.message }, 500);
  }
});

// Kalkulator Zakat
tools.get('/zakat', (c) => {
  const type = c.req.query('type'); // maal, penghasilan, fitrah
  const amount = parseFloat(c.req.query('amount') || 0);
  const hargaEmas = parseFloat(c.req.query('hargaEmas') || 1200000); // Default harga emas per gram

  if (!type) {
    return c.json({ 
      status: false, 
      message: 'Parameter type (maal/penghasilan/fitrah) diperlukan.' 
    }, 400);
  }

  if (isNaN(amount) || amount <= 0) {
    return c.json({ 
      status: false, 
      message: 'Parameter amount harus berupa angka valid dan lebih besar dari 0.' 
    }, 400);
  }

  let result = {
    status: true,
    message: 'Kalkulasi zakat berhasil.',
    data: {
      type: type,
      amount: amount,
      nishab: 0,
      isWajib: false,
      zakat: 0
    }
  };

  if (type === 'maal') {
    const nishabEmas = 85 * hargaEmas;
    result.data.nishab = nishabEmas;
    result.data.isWajib = amount >= nishabEmas;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = 'Nishab Zakat Maal adalah setara 85 gram emas per tahun. Tarif zakat 2,5%.';
  } 
  else if (type === 'penghasilan') {
    const nishabEmasBulan = (85 * hargaEmas) / 12;
    result.data.nishab = nishabEmasBulan;
    result.data.isWajib = amount >= nishabEmasBulan;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = 'Nishab Zakat Penghasilan setara 85 gram emas per tahun (dibagi 12 bulan). Tarif 2,5%.';
  }
  else if (type === 'fitrah') {
    const hargaBeras = parseFloat(c.req.query('hargaBeras') || 15000);
    const jumlahOrang = parseInt(c.req.query('jumlahOrang') || 1);
    const zakatPerOrang = 2.5 * hargaBeras; // 2.5 kg atau 3.5 liter beras
    result.data.nishab = 0;
    result.data.isWajib = true;
    result.data.zakat = zakatPerOrang * jumlahOrang;
    result.data.keterangan = `Zakat Fitrah adalah 2.5kg beras per jiwa. Estimasi Rp${zakatPerOrang.toLocaleString('id-ID')} per jiwa.`;
  } else {
    return c.json({ status: false, message: 'Tipe zakat tidak valid. Gunakan: maal, penghasilan, atau fitrah.' }, 400);
  }

  return c.json(result);
});

// Qibla Direction (Arah Kiblat)
tools.get('/qibla', async (c) => {
  const lat = parseFloat(c.req.query('lat'));
  const lng = parseFloat(c.req.query('lng'));

  if (isNaN(lat) || isNaN(lng)) {
    return c.json({ status: false, message: 'Parameter lat dan lng diperlukan dan harus berupa angka.' }, 400);
  }

  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  // Formula: tan(q) = sin(ΔL) / (cos(φ1)tan(φ2) - sin(φ1)cos(ΔL))
  const dL = (kaabaLng - lng) * Math.PI / 180;
  const phi1 = lat * Math.PI / 180;
  const phi2 = kaabaLat * Math.PI / 180;

  const q = Math.atan2(Math.sin(dL), (Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dL)));
  const direction = (q * 180 / Math.PI + 360) % 360;

  return c.json({
    status: true,
    message: 'Berhasil menghitung arah kiblat.',
    data: {
      coordinates: { lat, lng },
      kaaba: { lat: kaabaLat, lng: kaabaLng },
      qibla_direction: direction,
      unit: 'degrees'
    }
  });
});

// Semantic Search (RAG-lite) - Mencari berdasarkan kata kunci di Quran & Hadits
tools.get('/semantic-search', async (c) => {
  const query = c.req.query('query');

  if (!query) return c.json({ status: false, message: 'Parameter query diperlukan.' }, 400);

  try {
    // Cari di Quran
    const quranResults = await dbQuery(`
      SELECT *
      FROM ayah
      WHERE text LIKE ? OR theme LIKE ?
    `, [`%${query}%`, `%${query}%`]);

    const formattedQuran = await Promise.all(quranResults.map(async (r) => {
      const s = await dbGet(`SELECT * FROM surah WHERE number = ?`, [r.surah]);
      return {
        arab: r.arab,
        text: r.text,
        sumber: `QS. ${s.name_id || s.name_en || s.name_long}: ${r.ayah}`
      };
    }));

    // Cari di Hadits
    const haditsResults = await dbQuery(`
      SELECT *
      FROM hadits
      WHERE indo LIKE ? OR judul LIKE ?
    `, [`%${query}%`, `%${query}%`]);

    return c.json({
      status: true,
      message: `Pencarian semantik untuk '${query}' berhasil.`,
      data: {
        query: query,
        quran: formattedQuran,
        hadits: haditsResults.map(r => ({
          arab: r.arab,
          text: r.indo,
          sumber: `HR. ${r.judul || 'Hadits'}`
        }))
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Pencarian semantik gagal: ' + error.message }, 500);
  }
});

export default tools;
