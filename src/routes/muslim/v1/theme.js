import { Hono } from 'hono';
import { getThemes, getSurahList, getAyahBySurah } from '../../../utils/jsonHandler.js';

const theme = new Hono();

theme.get('/', async (c) => {
  try {
    const themeId = c.req.query('themeId') || c.req.query('id');
    const allThemes = await getThemes();
    if (!allThemes) return c.json({ status: false, message: 'Daftar tema tidak tersedia.', data: [] }, 404);

    if (themeId != null) {
      const themeData = allThemes.find(t => t.id == themeId);
      if (!themeData) {
        return c.json({ status: false, message: 'Tema tidak ditemukan.', data: [] }, 404);
      }

      const surahList = await getSurahList();
      let themeVerses = [];
      for (const s of surahList) {
        const ayahs = await getAyahBySurah(s.number);
        if (ayahs) {
          const filtered = ayahs.filter(a => {
            if (!a.theme) return false;
            const themes = a.theme.split(',').map(t => t.trim());
            return themes.includes(themeId.toString());
          });
          themeVerses.push(...filtered);
        }
      }

      const formatAyah = (a) => ({
        ...a,
        audio_partial: typeof a.audio_partial === 'string' ? JSON.parse(a.audio_partial) : (a.audio_partial || {})
      });

      return c.json({ 
        status: true, 
        message: `Berhasil mendapatkan ayat dengan tema: ${themeData.name}.`, 
        data: themeVerses.map(formatAyah) 
      });
    } else {
      const sortedThemes = [...allThemes].sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return c.json({ status: true, message: 'Berhasil mendapatkan daftar seluruh tema.', data: sortedThemes });
    }
  } catch (error) {
    return c.json({ status: false, message: 'Gagal mendapatkan data tema: ' + error.message }, 500);
  }
});

export default theme;
