import { Hono } from 'hono';
import { 
  getAyahBySurah, 
  getDzikir, 
  getDoa, 
  writeJson 
} from '../../../utils/jsonHandler.js';

const admin = new Hono();

// Middleware: Simple API Key Auth
const API_KEY = process.env.ADMIN_API_KEY || 'muslim-api-admin-secret';

admin.use('*', async (c, next) => {
  // Check if running on Vercel Production
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return c.json({ 
      status: false, 
      message: 'Pembaruan admin dinonaktifkan di Vercel Production. Harap gunakan strategi Pembaruan Lokal + Git Push.' 
    }, 403);
  }

  const apiKey = c.req.header('x-api-key');
  if (apiKey !== API_KEY) {
    return c.json({ status: false, message: 'Tidak diizinkan: API Key tidak valid atau tidak ada.' }, 401);
  }
  await next();
});

// Update Ayah
admin.patch('/ayah', async (c) => {
  try {
    const { surahId, ayahId, arab, text, latin } = await c.req.json();
    
    if (!surahId || !ayahId) {
      return c.json({ status: false, message: 'surahId dan ayahId diperlukan.' }, 400);
    }

    const ayahs = await getAyahBySurah(surahId);
    if (!ayahs) {
      return c.json({ status: false, message: 'Surah tidak ditemukan.' }, 404);
    }

    const index = ayahs.findIndex(a => a.ayah == ayahId);
    if (index === -1) {
      return c.json({ status: false, message: 'Ayat tidak ditemukan.' }, 404);
    }

    const oldData = { ...ayahs[index] };
    
    // Update fields
    if (arab) ayahs[index].arab = arab;
    if (text) ayahs[index].text = text;
    if (latin) ayahs[index].latin = latin;

    const success = await writeJson(`quran/ayah/${surahId}.json`, ayahs);

    if (!success) {
      return c.json({ status: false, message: 'Gagal menyimpan perubahan ke file JSON.' }, 500);
    }

    return c.json({ 
      status: true, 
      message: 'Berhasil memperbarui ayat.',
      diff: {
        before: { arab: oldData.arab, text: oldData.text, latin: oldData.latin },
        after: { arab: ayahs[index].arab, text: ayahs[index].text, latin: ayahs[index].latin }
      },
      integrity_status: 'Hash akan diperbarui otomatis pada pengecekan integritas berikutnya.'
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal memperbarui ayat: ' + error.message }, 500);
  }
});

// Update Dzikir
admin.patch('/dzikir', async (c) => {
  try {
    const { id, title, arabic, translation } = await c.req.json();
    
    if (!id) return c.json({ status: false, message: 'Parameter id diperlukan.' }, 400);

    const dzikirs = await getDzikir();
    if (!dzikirs) return c.json({ status: false, message: 'Daftar dzikir tidak tersedia.' }, 500);

    const index = dzikirs.findIndex(d => d.id == id);
    if (index === -1) return c.json({ status: false, message: 'Dzikir tidak ditemukan.' }, 404);

    const oldData = { ...dzikirs[index] };

    if (title) dzikirs[index].title = title;
    if (arabic) dzikirs[index].arabic = arabic;
    if (translation) dzikirs[index].translation = translation;

    const success = await writeJson('common/dzikir.json', dzikirs);

    if (!success) {
      return c.json({ status: false, message: 'Gagal menyimpan perubahan ke file JSON.' }, 500);
    }

    return c.json({
      status: true,
      message: 'Berhasil memperbarui dzikir.',
      diff: {
        before: { title: oldData.title, arabic: oldData.arabic, translation: oldData.translation },
        after: { title: dzikirs[index].title, arabic: dzikirs[index].arabic, translation: dzikirs[index].translation }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal memperbarui dzikir: ' + error.message }, 500);
  }
});

// Update Doa
admin.patch('/doa', async (c) => {
  try {
    const { id, title, arabic, translation } = await c.req.json();
    
    if (!id) return c.json({ status: false, message: 'Parameter id diperlukan.' }, 400);

    const doas = await getDoa();
    if (!doas) return c.json({ status: false, message: 'Daftar doa tidak tersedia.' }, 500);

    const index = doas.findIndex(d => d.id == id);
    if (index === -1) return c.json({ status: false, message: 'Doa tidak ditemukan.' }, 404);

    const oldData = { ...doas[index] };

    if (title) doas[index].title = title;
    if (arabic) doas[index].arabic = arabic;
    if (translation) doas[index].translation = translation;

    const success = await writeJson('common/doa.json', doas);

    if (!success) {
      return c.json({ status: false, message: 'Gagal menyimpan perubahan ke file JSON.' }, 500);
    }

    return c.json({
      status: true,
      message: 'Berhasil memperbarui doa.',
      diff: {
        before: { title: oldData.title, arabic: oldData.arabic, translation: oldData.translation },
        after: { title: doas[index].title, arabic: doas[index].arabic, translation: doas[index].translation }
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal memperbarui doa: ' + error.message }, 500);
  }
});

export default admin;
