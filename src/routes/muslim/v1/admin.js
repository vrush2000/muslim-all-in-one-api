import { Hono } from 'hono';
import { query as dbQuery, get as dbGet } from '../../../database/config.js';

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

    // Get old data for diff
    const oldData = await dbGet(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );

    if (!oldData) {
      return c.json({ status: false, message: 'Ayat tidak ditemukan.' }, 404);
    }

    const updates = [];
    const params = [];

    if (arab) { updates.push("arab = ?"); params.push(arab); }
    if (text) { updates.push("text = ?"); params.push(text); }
    if (latin) { updates.push("latin = ?"); params.push(latin); }

    if (updates.length === 0) {
      return c.json({ status: false, message: 'Tidak ada bidang yang disediakan untuk diperbarui.' }, 400);
    }

    params.push(surahId, ayahId);
    
    await dbQuery(
      `UPDATE ayah SET ${updates.join(", ")} WHERE surah = ? AND ayah = ?`,
      params
    );

    const newData = await dbGet(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );

    return c.json({ 
      status: true, 
      message: 'Berhasil memperbarui ayat.',
      diff: {
        before: oldData,
        after: newData
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

    const oldData = await dbGet("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: false, message: 'Dzikir tidak ditemukan.', data: {} }, 404);

    const updates = [];
    const params = [];

    if (title) { updates.push("title = ?"); params.push(title); }
    if (arabic) { updates.push("arabic = ?"); params.push(arabic); }
    if (translation) { updates.push("translation = ?"); params.push(translation); }

    if (updates.length === 0) return c.json({ status: false, message: 'Tidak ada data yang diubah.' }, 400);

    params.push(id);
    
    await dbQuery(
      `UPDATE dzikir SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    const newData = await dbGet("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);

    return c.json({
      status: true,
      message: 'Berhasil memperbarui dzikir.',
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: 'Gagal memperbarui dzikir: ' + error.message }, 500);
  }
});

// Update Doa
admin.patch('/doa', async (c) => {
  try {
    const { id, judul, arab, indo } = await c.req.json();
    
    if (!id) return c.json({ status: false, message: 'id diperlukan.' }, 400);

    const oldData = await dbGet("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: false, message: 'Doa tidak ditemukan.' }, 404);

    const updates = [];
    const params = [];

    if (judul) { updates.push("judul = ?"); params.push(judul); }
    if (arab) { updates.push("arab = ?"); params.push(arab); }
    if (indo) { updates.push("indo = ?"); params.push(indo); }

    if (updates.length === 0) return c.json({ status: false, message: 'Tidak ada bidang untuk diperbarui.' }, 400);

    params.push(id);
    await dbQuery(`UPDATE doa SET ${updates.join(", ")} WHERE id = ?`, params);

    const newData = await dbGet("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);

    return c.json({ 
      status: true, 
      message: 'Berhasil memperbarui doa.',
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default admin;
