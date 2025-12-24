<div align="center">
  <h1 align="center">MUSLIM ALL-IN-ONE API</h1>
  <p align="center">
    <strong>API Keislaman All-in-One: Al-Quran (Tafsir & Audio), Jadwal Sholat, Kalender Hijriah/Jawa, Dzikir, Doa, Hadits, serta Sistem Integritas Data Modern.</strong>
  </p>
   <p align="center">
    <a href="https://muslim-api.vercel.app"><strong>Dokumentasi</strong></a> · <a href="https://github.com/vrush2000/muslim-all-in-one-api/issues"><strong>Laporkan Bug</strong></a> · <a href="https://github.com/vrush2000/muslim-all-in-one-api/issues"><strong>Request Fitur</strong></a>
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
- **Frontend**: [Hono JSX](https://hono.dev/middleware/builtin/jsx) + [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) dengan [better-sqlite3](https://github.com/WiseLibs/node-better-sqlite3)
- **Runtime**: Node.js (ES Modules)
- **Deployment**: [Vercel](https://vercel.com/)

## ✨ Fitur Utama

Menyediakan berbagai data keislaman dari sumber terpercaya:

- 📖 **Al-Quran Indonesia**: Daftar Surah, Juz, Tafsir Kemenag, dan Kata per Kata.
- 🛡️ **Data Integrity (Blockchain-style)**: Verifikasi kemurnian teks Al-Quran menggunakan SHA-256.
- 🕌 **Jadwal Sholat**: Waktu sholat akurat berdasarkan lokasi (Kota/Kabupaten) di seluruh Indonesia.
- 📅 **Kalender**: Integrasi Kalender Hijriah dan Kalender Jawa yang sinkron.
- 🤲 **Doa-doa & Dzikir**: Kumpulan doa harian dan dzikir pagi/petang.
- 📚 **Hadits**: Kumpulan Hadits Arba'in dengan fitur pencarian.
- 🔊 **Audio**: Murottal merdu dari 6 Qari terkemuka.
- 🛠️ **Admin Management**: API khusus untuk koreksi data secara instan (Local mode).
- 🔍 **Search Engine**: Sistem pencarian cepat untuk Ayat dan Doa.


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

Project ini menggunakan strategi **Local Update + Git Push** karena keterbatasan sistem file read-only pada Vercel.

Jika Anda menemukan typo pada Al-Quran, Doa, atau Dzikir:
1. Jalankan aplikasi di **Lokal**.
2. Gunakan endpoint `/v1/admin/ayah`, `/v1/admin/dzikir`, atau `/v1/admin/doa` dengan method `PATCH`.
3. Sertakan Header `x-api-key` (default: `muslim-api-admin-secret` atau cek `.env`).
4. Setelah database lokal terupdate, lakukan `git commit` pada file `database/alquran.db` dan `git push` ke repository Anda.


## 🌍 Deployment (Vercel)

Project ini siap di-deploy ke Vercel dengan konfigurasi yang sudah tersedia di `vercel.json` dan `api/index.js`.

```bash
# Menggunakan Vercel CLI
vercel deploy --prod
```

## 📖 Dokumentasi API

Dokumentasi lengkap dapat diakses langsung melalui root URL aplikasi:
👉 [https://muslim-api.vercel.app](https://muslim-api.vercel.app)

---

## 📱 Contoh Project

Aplikasi yang menggunakan API ini:

[![Play Store](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=otang.app.muslim)

---

## ❓ FAQ (Frequently Asked Questions)

<details>
<summary><b>Apakah API ini gratis?</b></summary>
Ya, API ini 100% gratis untuk digunakan baik untuk proyek personal maupun komersial.
</details>

<details>
<summary><b>Dari mana sumber datanya?</b></summary>
Data teks Al-Quran, terjemahan, dan tafsir berasal dari Kemenag RI. Audio murottal disediakan melalui CDN equran.id, dan dataset awal dikelola oleh Otang45.
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

Project ini merupakan hasil pengembangan lanjut (migrasi & modernisasi) dari project asli yang dibangun oleh **[Otang45](https://github.com/Otang45)**. 

Kami memberikan apresiasi setinggi-tingginya kepada:
- **[Otang45](https://github.com/Otang45)**: Atas penyediaan dataset keislaman (SQLite) dan logika dasar API yang sangat bermanfaat.
- **[equran.id](https://equran.id)**: Atas penyediaan API v2 dan Content Delivery Network (CDN) untuk data murottal audio (6 Qari) yang sangat membantu dalam melengkapi fitur audio di project ini.

Tanpa kontribusi dari pihak-pihak di atas, project modern ini tidak akan selengkap dan secepat ini. Terima kasih atas inspirasi dan kerja kerasnya!

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.

<div align="center">
  Developed with ❤️ by <strong>Vrush Studio</strong>
</div>
