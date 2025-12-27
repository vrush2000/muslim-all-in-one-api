import { Hono } from 'hono';
import { getWord } from '../../../utils/jsonHandler.js';

const word = new Hono();

word.get('/', async (c) => {
  try {
    const surahId = c.req.query('surahId') || c.req.query('id');
    const ayahId = c.req.query('ayahId');

    const allWords = await getWord();
    if (!allWords) return c.json({ status: false, message: 'Daftar kata tidak tersedia.', data: [] }, 404);

    let data = allWords;

    if (surahId != null && ayahId != null) {
      data = allWords.filter(w => w.surah == surahId && w.ayah == ayahId);
    } else if (surahId != null) {
      data = allWords.filter(w => w.surah == surahId);
    }

    const sortedData = [...data].sort((a, b) => {
      const surahDiff = parseInt(a.surah) - parseInt(b.surah);
      if (surahDiff !== 0) return surahDiff;
      const ayahDiff = parseInt(a.ayah) - parseInt(b.ayah);
      if (ayahDiff !== 0) return ayahDiff;
      return parseInt(a.word) - parseInt(b.word);
    });
    
    return c.json({ status: true, message: 'Berhasil mendapatkan daftar kata.', data: sortedData });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data kata: ' + error.message }, 500);
  }
});

export default word;
