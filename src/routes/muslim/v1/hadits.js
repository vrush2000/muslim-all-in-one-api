import { Hono } from 'hono';
import { getHaditsArbain, getLocalHadits, getHaditsChapters } from '../../../utils/jsonHandler.js';
import { semanticSearch } from '../../../utils/semanticSearch.js';

const hadits = new Hono();

// Mapping ID buku ke file lokal
const bookFileMapping = {
  'arbain': 'arbain',
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
  'nasai': 'nasai',
  'ibnu-hibban': 'ibnu-hibban',
  'mustadrak': 'mustadrak',
  'syafii': 'syafii',
  'ibnu-khuzaimah': 'ibnu-khuzaimah',
  'daruquthni': 'daruquthni'
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
  'nasai': 'Sunan Nasai',
  'ibnu-hibban': 'Sahih Ibnu Hibban',
  'mustadrak': 'Al-Mustadrak',
  'syafii': 'Musnad Syafii',
  'ibnu-khuzaimah': 'Sahih Ibnu Khuzaimah',
  'daruquthni': 'Sunan Daruquthni',
  'arbain': 'Hadits Arbain Nawawi'
};

const bookCounts = {
  'bukhari': 6638,
  'muslim': 4933,
  'abu-daud': 4419,
  'ibnu-majah': 4285,
  'tirmidzi': 3625,
  'ahmad': 4305,
  'darimi': 2949,
  'malik': 1587,
  'nasai': 5364,
  'ibnu-hibban': 2769,
  'mustadrak': 673,
  'syafii': 1800,
  'ibnu-khuzaimah': 1808,
  'daruquthni': 4790
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
    available: bookCounts[id] || 'Lokal (JSON)'
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

// Chapters of a Specific Book
hadits.get('/books/:name/chapters', async (c) => {
  try {
    const name = c.req.param('name').toLowerCase();
    const targetBookFile = bookFileMapping[name];
    
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }

    const chapters = await getHaditsChapters(targetBookFile);
    if (!chapters) {
      return c.json({ 
        status: false, 
        message: `Chapter untuk kitab ${name} belum tersedia.`,
        data: [] 
      }, 404);
    }

    return c.json({
      status: true,
      message: `Berhasil mendapatkan daftar chapter untuk kitab ${bookDisplayNames[targetBookFile]}.`,
      data: chapters
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan daftar chapter: ' + error.message }, 500);
  }
});

// Specific Hadith Book (Local) - List hadiths with optional chapter filtering
hadits.get('/books/:name', async (c) => {
  try {
    const name = c.req.param('name').toLowerCase();
    const page = parseInt(c.req.query('page') || 1);
    const chapterId = c.req.query('chapter');
    const range = c.req.query('range');
    const limit = range ? 1000 : 50; // Default limit for range is larger
    
    const targetBookFile = bookFileMapping[name];
    if (!targetBookFile) {
      return c.json({ status: false, message: `Kitab ${name} tidak ditemukan.` }, 404);
    }

    let allHadits = await getLocalHadits(targetBookFile);
    if (!allHadits) {
      return c.json({ status: false, message: `Gagal memuat data kitab ${name}.` }, 500);
    }

    let message = `Berhasil mendapatkan daftar hadits dari kitab ${bookDisplayNames[targetBookFile]}`;
    let filteredInfo = null;

    // Filter by range if provided (e.g., range=1-6)
    if (range) {
      const rangeParts = range.split('-');
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0]);
        const end = parseInt(rangeParts[1]);
        
        if (!isNaN(start) && !isNaN(end)) {
          allHadits = allHadits.filter(h => h.number >= start && h.number <= end);
          message += ` - Range ${start} sampai ${end}`;
          filteredInfo = `Range ${start}-${end}`;
        }
      }
    }

    // Filter by chapter if provided (only if range is not provided or to further filter)
    if (chapterId && !range) {
      const chapters = await getHaditsChapters(targetBookFile);
      const chapter = chapters ? chapters.find(ch => ch.id == chapterId) : null;
      
      if (chapter) {
        const [start, end] = chapter.range.split(' - ').map(n => parseInt(n));
        allHadits = allHadits.filter(h => h.number >= start && h.number <= end);
        message += ` - Chapter ${chapter.name}`;
        filteredInfo = chapter.name;
      } else {
        return c.json({ status: false, message: `Chapter ${chapterId} tidak ditemukan untuk kitab ${name}.` }, 404);
      }
    }

    const offset = range ? 0 : (page - 1) * limit; // If range, start from beginning
    const displayName = bookDisplayNames[targetBookFile] || name;
    const paginatedData = allHadits.slice(offset, range ? allHadits.length : offset + limit).map(h => ({
      number: h.number,
      arab: h.arab,
      id: h.id,
      name: `HR. ${displayName.replace('Sahih ', '').replace('Sunan ', '').replace('Musnad ', '').replace('Muwatha ', '')}`
    }));

    return c.json({
      status: true,
      message: `${message}${range ? '' : ` (Halaman ${page})`}.`,
      data: {
        book: displayName,
        chapter: filteredInfo,
        total: allHadits.length,
        page: range ? 1 : page,
        limit: range ? allHadits.length : limit,
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

    // Opsi B: Cari di Semua Kitab (Global Search) jika book tidak ditentukan atau diset 'all'
    if (!book || book.toLowerCase() === 'all') {
      let combinedResults = [];
      
      // 1. Cari di Arbain dulu
      const allArbain = await getHaditsArbain();
      if (allArbain) {
        const arbainMatches = semanticSearch(allArbain, q, {
          fields: ['judul', 'indo'],
          limit: 10
        }).map(r => ({
          no: r.no,
          judul: r.judul,
          arab: r.arab,
          indo: r.indo,
          sumber: `Hadits Arbain No. ${r.no}: ${r.judul}`,
          kitab: 'Arbain'
        }));
        combinedResults.push(...arbainMatches);
      }

      // 2. Cari di kitab-kitab utama (Bukhari, Muslim, Abu Daud, dll)
      // Kita batasi per kitab agar tidak terlalu lambat
      const booksToSearch = ['bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah', 'ibnu-hibban', 'mustadrak', 'syafii'];
      
      for (const bookKey of booksToSearch) {
        const allHadits = await getLocalHadits(bookKey);
        if (allHadits) {
          const matches = semanticSearch(allHadits, q, {
            fields: ['id'],
            limit: 5
          });
          
          const displayName = bookDisplayNames[bookKey];
          combinedResults.push(...matches.map(h => ({
            no: h.number,
            judul: displayName,
            arab: h.arab,
            indo: h.id,
            sumber: `HR. ${displayName.replace('Sahih ', '').replace('Sunan ', '')} No. ${h.number}`,
            kitab: bookKey
          })));
        }
      }

      if (combinedResults.length === 0) {
        return c.json({
          status: false,
          message: `Tidak ada hadits ditemukan di kitab manapun dengan kata kunci: ${q}.`,
          data: []
        }, 404);
      }

      return c.json({
        status: true,
        message: `Berhasil mencari hadits di semua kitab dengan kata kunci: ${q}.`,
        data: combinedResults
      });
    }

    // Opsi C: Cari di Kitab Tertentu (Arbain)
    if (book.toLowerCase() === 'arbain') {
      const allArbain = await getHaditsArbain();
      
      if (!allArbain || allArbain.length === 0) {
        return c.json({ 
          status: false, 
          message: `Daftar hadits Arbain tidak tersedia.`,
          data: []
        }, 404);
      }

      const results = semanticSearch(allArbain, q, {
        fields: ['judul', 'indo'],
        boostFields: ['judul']
      });

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
          no: r.no,
          judul: r.judul,
          arab: r.arab,
          indo: r.indo,
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
          message: `Pencarian untuk buku '${book}' belum didukung. Gunakan: arbain, bukhari, muslim, abu-daud, ibnu-majah, tirmidzi, ahmad, darimi, malik, nasai, ibnu-hibban, mustadrak, syafii, ibnu-khuzaimah, atau daruquthni.`
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
      const results = semanticSearch(allHadits, q, {
        fields: ['id'],
        boostFields: [],
        limit: 50
      });

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
