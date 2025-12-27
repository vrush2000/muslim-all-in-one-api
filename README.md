<div align="center">
  <h1 align="center">MUSLIM ALL-IN-ONE API</h1>
  <p align="center">
    <strong>API Keislaman All-in-One: Al-Quran (Tafsir & Audio), Jadwal Sholat, Kalender Hijriah/Jawa, Dzikir, Doa, Hadits, Sejarah Islam, serta Sistem Integritas Data Modern.</strong>
  </p>
   <p align="center">
    <a href="https://muslim-all-in-one-api.vercel.app"><strong>Dokumentasi</strong></a> · <a href="https://github.com/vrush2000/muslim-all-in-one-api/issues"><strong>Laporkan Bug</strong></a> · <a href="https://github.com/vrush2000/muslim-all-in-one-api/issues"><strong>Request Fitur</strong></a>
  </p>
  <div align="center">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/vrush2000/muslim-all-in-one-api">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/vrush2000/muslim-all-in-one-api">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/vrush2000/muslim-all-in-one-api">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/vrush2000/muslim-all-in-one-api">
    <img alt="GitHub license" src="https://img.shields.io/github/license/vrush2000/muslim-all-in-one-api">
  </div>
  <br />
  <div align="center">
    <a href="https://quran.kemenag.go.id/">
      <img src="https://img.shields.io/badge/Sumber%20Data-Resmi%20Kemenag%20RI-emerald?style=for-the-badge&logo=gov.uk&logoColor=white" alt="Sumber Data Resmi Kemenag RI">
    </a>
    <a href="https://equran.id/">
      <img src="https://img.shields.io/badge/Audio%20CDN-equran.id-blue?style=for-the-badge&logo=soundcloud&logoColor=white" alt="Audio CDN equran.id">
    </a>
  </div>
</div>

---

## 🚀 Tech Stack Modern

Project ini telah dimigrasi dari Express ke **Hono Node.js** untuk performa yang lebih baik dan kesiapan deployment (seperti Vercel).

- **Backend**: [Hono](https://hono.dev/) (Fast, Lightweight, and Web-standard)
- **Frontend**: [Hono JSX](https://hono.dev/middleware/builtin/jsx) + [Tailwind CSS](https://tailwindcss.com/) (Bundled with Esbuild for Vercel)
- **Database**: [JSON Storage](https://www.json.org/) (High-performance static data)
- **Runtime**: Node.js (ES Modules)
- **Deployment**: [Vercel](https://vercel.com/) (Serverless with Edge Caching)

## ✨ Fitur Utama

Menyediakan berbagai data keislaman dari sumber terpercaya:

- 📖 **Al-Quran Indonesia**: Daftar Surah, Juz, Tafsir Kemenag, dan Kata per Kata.
- 🛡️ **Data Integrity Chain**: Verifikasi kemurnian teks Al-Quran menggunakan sistem SHA-256 Hashing yang transparan.
- 🕌 **Jadwal Sholat**: Waktu sholat akurat berdasarkan lokasi (Kota/Kabupaten) di seluruh Indonesia.
- 📅 **Kalender**: Integrasi Kalender Hijriah dan Kalender Jawa yang sinkron.
- 🤲 **Doa-doa & Dzikir**: Kumpulan doa harian dan dzikir pagi/petang.
- 📚 **Hadits**: Kumpulan Hadits Arba'in dan 9 Imam dengan fitur pencarian.
- 🏛️ **Sejarah Islam**: Informasi peristiwa sejarah Islam yang penting.
- 🎧 **Audio**: Murottal merdu dari 6 Qari terkemuka.
- 🛡️ **Data Integrity Chain**: Verifikasi kemurnian teks Al-Quran menggunakan sistem SHA-256 Hashing yang transparan.
- 🔍 **Search Engine**: Sistem pencarian cepat untuk Ayat, Hadits, dan Doa.
- 🛠️ **Admin Management**: API khusus untuk koreksi data secara instan (Local mode).

## 🛡️ Verifikasi Integritas Data (Proof of Authenticity)

Kami sangat menjunjung tinggi kemurnian teks Al-Quran. Untuk memastikan data tidak dimanipulasi, kami menyediakan sistem **Integrity Chain**.

### Cara Verifikasi Mandiri:
1. Panggil endpoint `/v1/integrity/chain` untuk mendapatkan daftar hash resmi.
2. Bandingkan `content_hash` dengan hasil hashing manual dari data ayat:
   ```javascript
   // Contoh verifikasi menggunakan Node.js
   const crypto = require('crypto');
   
   // Ambil data dari /v1/ayah/surah?surahId=1
   const ayahs = [/* data dari API */];
   
   // Filter hanya field yang di-hash (arab & text)
   const dataToHash = ayahs.map(a => ({ arab: a.arab, text: a.text }));
   
   const hash = crypto.createHash('sha256')
     .update(JSON.stringify(dataToHash))
     .digest('hex');
     
   console.log('Hash Valid:', hash === officialContentHash);
   ```

Setiap perubahan satu karakter saja pada teks Arab atau terjemahan akan merusak rantai hash, sehingga integritas data selalu terjaga secara publik.

### Fitur Live Comparison:
Endpoint `/v1/integrity/verify/ayah` kini mendukung **Live Comparison**. Saat dipanggil, sistem akan mengambil data pembanding secara real-time dari sumber resmi (Kemenag via EQuran.id) dan menyajikannya berdampingan dengan data kami untuk membuktikan bahwa tidak ada perbedaan teks.

## 🤝 Kontribusi & Koreksi Data

Akurasi data adalah prioritas utama kami. Jika Anda menemukan perbedaan teks dengan sumber resmi (Kemenag RI):
1. Verifikasi melalui [quran.kemenag.go.id](https://quran.kemenag.go.id/quran/per-ayat/surah/1?from=1&to=1).
2. Laporkan melalui **GitHub Issues** dengan menyertakan nomor Surah dan Ayat.
3. Kami akan melakukan koreksi pada file JSON di `src/data` dan melakukan push update secepatnya.
4. Setiap koreksi akan secara otomatis memperbarui **Integrity Chain** untuk memastikan transparansi.


## 🛠️ Instalasi Lokal

Ikuti langkah berikut untuk menjalankan project di komputer Anda:

1. **Clone Repository**
   ```bash
   git clone https://github.com/vrush2000/muslim-all-in-one-api.git
   cd muslim-api
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

3. **Install Dependensi**
   ```bash
   npm install
   ```

4. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000`

## 📝 Manajemen Data & Koreksi Typo

Project ini menggunakan strategi **Local Update + Git Push** dengan penyimpanan berbasis file JSON untuk memastikan kompatibilitas penuh dengan Vercel.

Jika Anda menemukan typo pada Al-Quran, Doa, atau Dzikir:
1. Jalankan aplikasi di **Lokal**.
2. Gunakan endpoint `/v1/admin/ayah`, `/v1/admin/dzikir`, atau `/v1/admin/doa` with method `PATCH`.
3. Sertakan Header `x-api-key` (default: `muslim-api-admin-secret` atau cek `.env`).
4. Setelah file JSON lokal di `src/data` terupdate, lakukan `git commit` dan `git push` ke repository Anda. Vercel akan secara otomatis melakukan redeploy dengan data terbaru.


## 🌍 Deployment (Vercel)

Project ini siap di-deploy ke Vercel dengan konfigurasi yang sudah tersedia di `vercel.json` dan `api/index.js`.

```bash
# Menggunakan Vercel CLI
vercel deploy --prod
```

## 📖 Dokumentasi API

Dokumentasi lengkap dapat diakses langsung melalui root URL aplikasi:
👉 [https://muslim-all-in-one-api.vercel.app](https://muslim-all-in-one-api.vercel.app)

---

## 📱 Contoh Project

Aplikasi yang menggunakan API ini:

[![Play Store](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/developer?id=Vrush+Studio)

---

## ❓ FAQ (Frequently Asked Questions)

<details>
<summary><b>Apakah API ini gratis?</b></summary>
Ya, API ini 100% gratis untuk digunakan baik untuk proyek personal maupun komersial.
</details>

<details>
<summary><b>Dari mana sumber datanya?</b></summary>
Data teks Al-Quran, terjemahan, dan tafsir berasal dari Kemenag RI. Audio murottal disediakan melalui CDN equran.id, dan dataset awal dikelola oleh Otangid.
</details>

<details>
<summary><b>Apakah ada batasan rate limit?</b></summary>
Saat ini tidak ada batasan rate limit yang ketat, namun kami menyarankan untuk melakukan caching di sisi aplikasi Anda.
</details>

<details>
<summary><b>Apakah data Al-Quran ini sudah sesuai standar?</b></summary>
Ya, teks dan terjemahan mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI) dari Kementerian Agama RI.
</details>

---

## ❤️ Apresiasi & Penghormatan

Project ini merupakan hasil pengembangan lanjut (migrasi & modernisasi) dari project asli yang dibangun oleh **[Otangid](https://github.com/Otangid/muslim-api)**. 

Kami memberikan apresiasi setinggi-tingginya kepada para penyedia data dan sumber inspirasi:

- **[Kemenag RI](https://quran.kemenag.go.id/)**: Atas penyediaan data Al-Quran, Terjemahan, dan Tafsir resmi.
- **[Otangid](https://github.com/Otangid/muslim-api)**: Atas penyediaan dataset keislaman dan logika dasar API yang menjadi fondasi project ini.
- **[equran.id](https://equran.id)**: Atas penyediaan API v2 dan Content Delivery Network (CDN) untuk data murottal audio (6 Qari).
- **[MyQuran (SutanLab)](https://api.myquran.com/)**: Atas penyediaan dataset jadwal sholat akurat untuk seluruh wilayah Indonesia.
- **[Hadith Gading](https://api.hadith.gading.dev/)**: Atas penyediaan koleksi hadits digital yang sangat lengkap.
- **[Designstub](http://www.designstub.com/)**: Atas inspirasi desain template UI yang modern dan bersih.

Tanpa kontribusi dan sumber daya terbuka dari pihak-pihak di atas, project modern ini tidak akan mungkin terwujud. Terima kasih atas inspirasi dan kerja kerasnya bagi ekosistem pengembang aplikasi Islami!

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.

<div align="center">
  Developed with ❤️ by <strong>Vrush Studio</strong>
</div>
