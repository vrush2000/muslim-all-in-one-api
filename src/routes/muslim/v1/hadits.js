import { Hono } from 'hono';
import { getHaditsArbain, getLocalHadits } from '../../../utils/jsonHandler.js';

const hadits = new Hono();

// Mapping ID buku ke file lokal
const bookFileMapping = {
  'bukhari': 'bukhari',
  'muslim': 'muslim',
  'abu-daud': 'abu-daud',
  'abudawud': 'abu-daud',
  'ibnu-majah': 'ibnu-majah',
  'ibnmajah': 'ibnu-majah',
  'tirmidzi': 'tirmidzi',
  'tirmidhi': 'tirmidzi',
  'ahmad': 'ahmad',
  'darimi': 'darimi',
  'malik': 'malik',
  'nasai': 'nasai'
};

const bookDisplayNames = {
  'bukhari': 'Sahih Bukhari',
  'muslim': 'Sahih Muslim',
  'abu-daud': 'Sunan Abu Daud',
  'ibnu-majah': 'Sunan Ibnu Majah',
  'tirmidzi': 'Sunan Tirmidzi',
  'ahmad': 'Musnad Ahmad',
  'darimi': 'Sunan Darimi',
  'malik': 'Muwatha Malik',
  'nasai': 'Sunan Nasai'
};

// Hadits Arbain (Existing)
hadits.get('/', async (c) => {
  try {
    const nomor = c.req.query('nomor');
    const allArbain = await getHaditsArbain();
    if (!allArbain) return c.json({ status: false, message: 'Daftar hadits tidak tersedia.', data: [] }, 404);

    if (nomor != null) {
      const data = allArbain.find(h => h.no == nomor);
      if (!data) {
        return c.json({ status: false, message: 'Hadits tidak ditemukan.', data: {} }, 404);
      } else {
        return c.json({ status: true, message: 'Berhasil mendapatkan detail Hadits Arbain.', data });
      }
    } else {
      const sortedData = [...allArbain].sort((a, b) => parseInt(a.no) - parseInt(b.no));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar Hadits Arbain.', data: sortedData });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data hadits: ' + error.message }, 500);
  }
});

// List of Hadith Books (Local)
hadits.get('/books', (c) => {
  const books = Object.entries(bookDisplayNames).map(([id, name]) => ({
    id,
    name: `HR. ${name.replace('Sahih ', '').replace('Sunan ', '').replace('Musnad ', '').replace('Muwatha ', '')}`,
    available: 'Lokal (JSON)'
  }));

  return c.json({
    status: true,
    message: "Berhasil mendapatkan seluruh koleksi kitab hadits.",
    data: [
      { id: 'arbain', name: 'Hadits Arbain Nawawi', available: 42 },
      ...books
    ]
  });
});

// Specific Hadith Book (Local) - List first 50 hadiths
hadits.get('/books/:name', async (c) => {
  try {
    const name = c.req.param('name').toLowerCase();
    const page = parseInt(c.req.query('page') || 1);
    const limit = 50;
    const offset = (page - 1) * limit;

    const targetBookFile = bookFileMapping[name];
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }

    const allHadits = await getLocalHadits(targetBookFile);
    if (!allHadits) {
      return c.json({ status: false, message: `Gagal memuat data kitab ${name}.` }, 500);
    }

    const displayName = bookDisplayNames[targetBookFile] || name;
    const paginatedData = allHadits.slice(offset, offset + limit).map(h => ({
      number: h.number,
      arab: h.arab,
      id: h.id,
      name: `HR. ${displayName.replace('Sahih ', '').replace('Sunan ', '').replace('Musnad ', '').replace('Muwatha ', '')}`
    }));

    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar hadits dari kitab ${displayName} (Halaman ${page}).`,
      data: {
        book: displayName,
        total: allHadits.length,
        page,
        limit,
        hadiths: paginatedData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar hadits: ' + error.message }, 500);
  }
});

// Specific Hadith by Number (Local)
hadits.get('/books/:name/:number', async (c) => {
  try {
    const name = c.req.param('name').toLowerCase();
    const number = parseInt(c.req.param('number'));
    
    const targetBookFile = bookFileMapping[name];
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }

    const allHadits = await getLocalHadits(targetBookFile);
    if (!allHadits) {
      return c.json({ status: false, message: `Gagal memuat data kitab ${name}.` }, 500);
    }

    const hadith = allHadits.find(h => h.number === number);
    if (!hadith) {
      return c.json({ status: false, message: `Hadits nomor ${number} tidak ditemukan di kitab ${name}.` }, 404);
    }

    const displayName = bookDisplayNames[targetBookFile] || name;
    return c.json({
      status: true,
      message: `Berhasil mendapatkan detail hadits nomor ${number} dari kitab ${displayName}.`,
      data: {
        number: hadith.number,
        arab: hadith.arab,
        id: hadith.id, // Bahasa Indonesia
        name: `HR. ${displayName.replace('Sahih ', '').replace('Sunan ', '').replace('Musnad ', '').replace('Muwatha ', '')}`
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan detail hadits: ' + error.message }, 500);
  }
});

// Cari Hadits (Query)
hadits.get('/find', async (c) => {
  try {
    const q = c.req.query('query');
    const book = c.req.query('book');

    if (!q) {
      return c.json({
        status: false,
        message: "Parameter query diperlukan.",
      }, 400);
    }

    // Opsi B: Hadits Arbain (Data JSON)
    if (!book || book.toLowerCase() === 'arbain') {
      const allArbain = await getHaditsArbain();
      
      if (!allArbain || allArbain.length === 0) {
        return c.json({ 
          status: false, 
          message: `Daftar hadits Arbain tidak tersedia.`,
          data: []
        }, 404);
      }

      const queryLower = q.toLowerCase();
      const results = allArbain.filter(r => 
        (r.judul && r.judul.toLowerCase().includes(queryLower)) || 
        (r.indo && r.indo.toLowerCase().includes(queryLower))
      );

      if (results.length === 0) {
        return c.json({ 
          status: false, 
          message: `Tidak ada hadits Arbain yang ditemukan dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }

      return c.json({ 
        status: true, 
        message: `Berhasil mencari hadits Arbain dengan kata kunci: ${q}.`, 
        data: results.map(r => ({
          ...r,
          sumber: `Hadits Arbain No. ${r.no}: ${r.judul}`
        }))
      });
    } 
    
    // Opsi A: Hadits dari File JSON Lokal
    else {
      const targetBookFile = bookFileMapping[book.toLowerCase()];
      
      if (!targetBookFile) {
        return c.json({
          status: false,
          message: `Pencarian untuk buku '${book}' belum didukung. Gunakan: arbain, bukhari, muslim, abu-daud, ibnu-majah, tirmidzi, ahmad, darimi, malik, atau nasai.`
        }, 400);
      }

      const allHadits = await getLocalHadits(targetBookFile);
      if (!allHadits) {
        return c.json({
          status: false,
          message: `Gagal membaca data hadits untuk kitab ${book}.`
        }, 500);
      }

      // Cari secara manual di array
      const searchTerms = q.toLowerCase().split(' ');
      const results = allHadits.filter(h => {
        const text = (h.id || '').toLowerCase(); // Field 'id' berisi terjemahan Indo
        return searchTerms.every(term => text.includes(term));
      }).slice(0, 50);

      if (results.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada hadits ditemukan di kitab ${book} dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }

      const displayName = bookDisplayNames[targetBookFile] || book;
      return c.json({
        status: true,
        message: `Berhasil mencari hadits di kitab ${displayName} dengan kata kunci: ${q}.`,
        data: results.map(h => ({
          no: h.number,
          judul: displayName,
          arab: h.arab,
          indo: h.id, // Field 'id' adalah terjemahan Indonesia
          sumber: `HR. ${displayName.replace('Sahih ', '').replace('Sunan ', '').replace('Musnad ', '').replace('Muwatha ', '')} No. ${h.number}`
        }))
      });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mencari hadits: ' + error.message }, 500);
  }
});

export default hadits;
