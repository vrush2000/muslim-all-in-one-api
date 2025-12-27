import { Hono } from 'hono';
import { getSurahList, getAyahBySurah, getHaditsArbain, getLocalHadits, getPuasa, getFiqhPuasa } from '../../../utils/jsonHandler.js';

const tools = new Hono();

// Daily Quotes (Ayat/Hadits Hari Ini)
tools.get('/quotes/daily', async (c) => {
  try {
    const surahList = await getSurahList();
    if (!surahList) throw new Error('Daftar surah tidak tersedia');

    // Pilih surah acak
    const randomSurah = surahList[Math.floor(Math.random() * surahList.length)];
    const ayahs = await getAyahBySurah(randomSurah.number);
    if (!ayahs) throw new Error('Daftar ayat tidak tersedia');

    // Pilih ayat acak
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
    const surahName = randomSurah.name_id || randomSurah.name_en || randomSurah.name_long;

    // Ambil 1 hadits arbain acak
    const allArbain = await getHaditsArbain();
    const randomHadits = allArbain ? allArbain[Math.floor(Math.random() * allArbain.length)] : null;

    return c.json({
      status: true,
      message: 'Berhasil mengambil kutipan harian.',
      data: {
        ayat: {
          arab: randomAyah.arab,
          text: randomAyah.text,
          sumber: `QS. ${surahName}: ${randomAyah.ayah}`
        },
        hadits: randomHadits ? {
          arab: randomHadits.arab,
          text: randomHadits.indo,
          sumber: `Hadits Arbain No. ${randomHadits.no}: ${randomHadits.judul}`
        } : null
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
    result.data.sumber = 'BAZNAS (Badan Amil Zakat Nasional)';
  } 
  else if (type === 'penghasilan') {
    const nishabEmasBulan = (85 * hargaEmas) / 12;
    result.data.nishab = nishabEmasBulan;
    result.data.isWajib = amount >= nishabEmasBulan;
    result.data.zakat = result.data.isWajib ? amount * 0.025 : 0;
    result.data.keterangan = 'Nishab Zakat Penghasilan setara 85 gram emas per tahun (dibagi 12 bulan). Tarif 2,5%.';
    result.data.sumber = 'Peraturan Menteri Agama No. 31 Tahun 2019 & BAZNAS';
  }
  else if (type === 'fitrah') {
    const hargaBeras = parseFloat(c.req.query('hargaBeras') || 15000);
    const jumlahOrang = parseInt(c.req.query('jumlahOrang') || 1);
    const zakatPerOrang = 2.5 * hargaBeras; // 2.5 kg atau 3.5 liter beras
    result.data.nishab = 0;
    result.data.isWajib = true;
    result.data.zakat = zakatPerOrang * jumlahOrang;
    result.data.keterangan = `Zakat Fitrah adalah 2.5kg beras per jiwa. Estimasi Rp${zakatPerOrang.toLocaleString('id-ID')} per jiwa.`;
    result.data.sumber = 'Ketentuan Fiqh (Zakat Fitrah 2.5kg/3.5 liter beras)';
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
    const queryLower = query.toLowerCase();
    const searchTerms = queryLower.split(' ');

    // Cari di Quran
    const surahList = await getSurahList();
    let quranResults = [];
    
    for (const s of surahList) {
      const ayahs = await getAyahBySurah(s.number);
      if (ayahs) {
        const matches = ayahs.filter(a => {
          const text = (a.text || '').toLowerCase();
          return searchTerms.every(term => text.includes(term));
        }).slice(0, 5);

        if (matches.length > 0) {
          const surahName = s.name_id || s.name_en || s.name_long;
          quranResults.push(...matches.map(a => ({
            arab: a.arab,
            text: a.text,
            sumber: `QS. ${surahName}: ${a.ayah}`
          })));
        }
      }
      if (quranResults.length >= 10) break;
    }

    // Cari di Hadits Arbain
    const allArbain = await getHaditsArbain();
    const arbainMatches = allArbain ? allArbain.filter(h => {
      const text = (h.judul + ' ' + h.indo).toLowerCase();
      return searchTerms.every(term => text.includes(term));
    }).slice(0, 5) : [];

    const formattedArbain = arbainMatches.map(h => ({
      arab: h.arab,
      text: h.indo,
      sumber: `Hadits Arbain No. ${h.no}: ${h.judul}`
    }));

    // Cari di Kitab Hadits (9 Kitab + Arbain) secara lokal
    let globalHadits = [];
    const allBooks = [
      'bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 
      'ibnu-majah', 'ahmad', 'darimi', 'malik'
    ];

    for (const book of allBooks) {
      const allHadits = await getLocalHadits(book);
      if (allHadits) {
        const matches = allHadits.filter(h => {
          const text = (h.id || '').toLowerCase();
          return searchTerms.every(term => text.includes(term));
        }).slice(0, 2);

        const bookName = book.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        globalHadits.push(...matches.map(h => ({
          arab: h.arab,
          text: h.id,
          sumber: `HR. ${bookName} No. ${h.number}`
        })));
      }
      if (globalHadits.length >= 15) break;
    }

    const totalHadits = [...formattedArbain, ...globalHadits];

    // Cari di Puasa & Fiqh
    const allPuasa = await getPuasa();
    const puasaMatches = allPuasa ? allPuasa.filter(p => {
      const text = (p.nama + ' ' + p.deskripsi + ' ' + p.dalil).toLowerCase();
      return searchTerms.every(term => text.includes(term));
    }).slice(0, 5) : [];

    const formattedPuasa = puasaMatches.map(p => ({
      text: `${p.nama}: ${p.deskripsi}`,
      dalil: p.dalil,
      sumber: `Fitur Puasa (${p.hukum})`
    }));

    const allFiqh = await getFiqhPuasa();
    let fiqhResults = [];
    if (allFiqh) {
      for (const category of allFiqh) {
        const matches = category.points.filter(pt => {
          const text = (pt.title + ' ' + pt.content).toLowerCase();
          return searchTerms.every(term => text.includes(term));
        }).slice(0, 3);
        
        fiqhResults.push(...matches.map(pt => ({
          text: pt.title,
          content: pt.content,
          sumber: `70 Masalah Puasa - Sumber: islamqa.info`
        })));
        if (fiqhResults.length >= 10) break;
      }
    }

    if (quranResults.length === 0 && totalHadits.length === 0 && formattedPuasa.length === 0 && fiqhResults.length === 0) {
      return c.json({
        status: false,
        message: `Tidak ada hasil pencarian semantik untuk '${query}'.`,
        data: {
          query: query,
          quran: [],
          hadits: [],
          puasa: [],
          fiqh: []
        }
      }, 404);
    }

    return c.json({
      status: true,
      message: `Pencarian semantik untuk '${query}' berhasil.`,
      data: {
        query: query,
        quran: quranResults,
        hadits: totalHadits,
        puasa: formattedPuasa,
        fiqh: fiqhResults
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Pencarian semantik gagal: ' + error.message }, 500);
  }
});

/**
 * Kalkulator Waris (Faraidh)
 * Berdasarkan Hukum Waris Islam (Kompilasi Hukum Islam)
 */
tools.get('/faraidh', (c) => {
  try {
    const totalHarta = parseFloat(c.req.query('totalHarta') || 0);
    const suami = parseInt(c.req.query('suami') || 0);
    const istri = parseInt(c.req.query('istri') || 0);
    const anakLk = parseInt(c.req.query('anakLk') || 0);
    const anakPr = parseInt(c.req.query('anakPr') || 0);
    const ayah = c.req.query('ayah') === 'true';
    const ibu = c.req.query('ibu') === 'true';

    if (totalHarta <= 0) {
      return c.json({ status: false, message: 'Total harta harus lebih besar dari 0.' }, 400);
    }

    if (suami > 0 && istri > 0) {
      return c.json({ status: false, message: 'Tidak mungkin ada suami dan istri secara bersamaan dalam satu kasus waris.' }, 400);
    }

    let results = [];
    let denominators = []; // Untuk menghitung KPK/Aul
    
    const adaAnak = anakLk > 0 || anakPr > 0;
    
    // 1. Tentukan Bagian Pasti (Ashabul Furud)
    let furud = {
      suami: 0,
      istri: 0,
      ibu: 0,
      ayah: 0,
      anakPr: 0
    };

    // Suami
    if (suami > 0) {
      furud.suami = adaAnak ? 1/4 : 1/2;
    }

    // Istri
    if (istri > 0) {
      furud.istri = adaAnak ? 1/8 : 1/4;
    }

    // Ibu
    if (ibu) {
      furud.ibu = adaAnak ? 1/6 : 1/3;
    }

    // Ayah (sebagai ahli waris fard jika ada anak laki-laki)
    if (ayah) {
      if (anakLk > 0) {
        furud.ayah = 1/6;
      } else if (anakPr > 0) {
        furud.ayah = 1/6; // Nanti ditambah sisa jika ada
      } else {
        furud.ayah = 0; // Asabah murni
      }
    }

    // Anak Perempuan (jika tidak ada anak laki-laki)
    if (anakLk === 0 && anakPr > 0) {
      if (anakPr === 1) {
        furud.anakPr = 1/2;
      } else {
        furud.anakPr = 2/3;
      }
    }

    // Hitung Total Furud
    let totalFurud = furud.suami + furud.istri + furud.ibu + furud.ayah + furud.anakPr;

    // 2. Handle Asabah (Sisa)
    let sisa = 1 - totalFurud;
    let asabah = {
      ayah: 0,
      anakLk: 0,
      anakPr: 0
    };

    if (sisa > 0) {
      // Ayah menjadi asabah jika tidak ada anak laki-laki
      if (ayah && anakLk === 0) {
        asabah.ayah = sisa;
        sisa = 0;
      } 
      // Jika ada anak laki-laki, anak-anak menjadi asabah
      else if (anakLk > 0) {
        const totalRasio = (anakLk * 2) + anakPr;
        const perBagian = sisa / totalRasio;
        asabah.anakLk = perBagian * 2 * anakLk;
        asabah.anakPr = perBagian * anakPr;
        sisa = 0;
      }
    }

    // 3. Handle Aul (Jika total bagian > 1)
    if (totalFurud > 1) {
      const faktorAul = 1 / totalFurud;
      furud.suami *= faktorAul;
      furud.istri *= faktorAul;
      furud.ibu *= faktorAul;
      furud.ayah *= faktorAul;
      furud.anakPr *= faktorAul;
      totalFurud = 1;
    }

    // 4. Handle Radd (Jika total bagian < 1 dan tidak ada asabah)
    // Sederhananya, radd dibagi ke semua fard kecuali suami/istri
    if (totalFurud < 1 && anakLk === 0 && !(ayah)) {
      let raddBeneficiaries = furud.ibu + furud.anakPr;
      if (raddBeneficiaries > 0) {
        const faktorRadd = (1 - (furud.suami + furud.istri)) / raddBeneficiaries;
        furud.ibu *= faktorRadd;
        furud.anakPr *= faktorRadd;
      }
    }

    // Susun Response
    const addResult = (nama, rasio, jumlah = 1) => {
      if (rasio > 0) {
        results.push({
          ahli_waris: nama,
          jumlah: jumlah,
          bagian_persen: (rasio * 100).toFixed(2) + '%',
          nominal: Math.floor(totalHarta * rasio)
        });
      }
    };

    addResult('Suami', furud.suami);
    addResult('Istri', furud.istri, istri);
    addResult('Ibu', furud.ibu);
    addResult('Ayah', furud.ayah + asabah.ayah);
    addResult('Anak Laki-laki', asabah.anakLk, anakLk);
    addResult('Anak Perempuan', furud.anakPr + asabah.anakPr, anakPr);

    return c.json({
      status: true,
      message: 'Kalkulasi waris berhasil.',
      data: {
        total_harta: totalHarta,
        rincian: results,
        zakat_harta: totalHarta >= 85000000 ? Math.floor(totalHarta * 0.025) : 0, // Reminder zakat jika mencapai nishab
        keterangan: 'Perhitungan ini menggunakan standar ilmu Faraidh (KHI). Sangat disarankan untuk berkonsultasi dengan ahli agama/KUA setempat.',
        sumber: 'Kompilasi Hukum Islam (KHI) & Fiqh Mawaris'
      }
    });

  } catch (error) {
    return c.json({ status: false, message: 'Gagal menghitung waris: ' + error.message }, 500);
  }
});

export default tools;
