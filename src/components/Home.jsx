/** @jsx jsx */
import { jsx } from 'hono/jsx'

const ApiEndpoint = ({ method, path, title, responseJson, category, endpointId }) => (
  <div class="mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
      <h4 class="font-semibold text-slate-900">{title}</h4>
      <div class="flex gap-2">
        <span class={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {method}
        </span>
      </div>
    </div>
    <div class="p-6">
      <div class="flex items-center gap-2 mb-6 group">
        <div class="flex-grow flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:border-emerald-200 transition-colors">
          <code class="text-sm font-mono text-slate-600 truncate">{path}</code>
        </div>
        <div class="flex gap-2">
          <button 
            onclick={`window.openJsonModal('${path}')`}
            class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Live Preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            onclick={`navigator.clipboard.writeText(window.location.origin + '/v1${path}')`}
            class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Copy URL"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="space-y-4">
        <details class="group">
          <summary class="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors list-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            Example Response
          </summary>
          <div class="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <pre class="text-[11px] leading-relaxed shadow-inner">
              <code>{responseJson}</code>
            </pre>
          </div>
        </details>
      </div>
    </div>
  </div>
)

const SectionTitle = ({ title, icon, id, color = "emerald" }) => (
  <div id={id} class="flex items-center gap-3 mb-8 scroll-mt-24">
    <div class={`w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${color}-100`}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-slate-900">{title}</h2>
  </div>
)

export const Home = ({ baseUrl }) => {
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside class="hidden lg:block col-span-1 sticky top-28 self-start">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</h3>
            <nav class="space-y-1">
              {[
                { name: 'Introduction', href: '#intro', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Quran', href: '#quran', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                { name: 'Integrity', href: '#integrity', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { name: 'FAQ', href: '#faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                  </svg>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div class="col-span-1 lg:col-span-3">
          <section id="intro" class="mb-20 scroll-mt-24">
            <div class="flex flex-wrap gap-3 mb-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                v1.0.0 Stable
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z" />
                </svg>
                Verified Data Source: Kemenag RI
              </div>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Muslim <span class="text-emerald-600 block md:inline">All-in-One API</span>
            </h1>
            <p class="text-xl text-slate-600 leading-relaxed mb-10 max-w-3xl">
              Akses data keislaman terlengkap dengan performa tinggi. Dibangun untuk pengembang yang ingin membuat aplikasi islami.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 mb-2">Base URL</h3>
                <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <code class="text-sm text-emerald-600 font-mono font-bold">{baseUrl}</code>
                </div>
              </div>
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 mb-2">Format</h3>
                <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <code class="text-sm text-blue-600 font-mono font-bold">application/json</code>
                </div>
              </div>
            </div>
          </section>

          <SectionTitle 
            id="quran" 
            title="Al-Quran Indonesia" 
            icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
          <ApiEndpoint 
            title="Daftar Surah" 
            method="GET" 
            path="/surah" 
            category="quran"
            endpointId="list-surah"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "number": "1",
      "name_id": "Al-Fatihah",
      "name_short": "الفاتحة",
      "number_of_verses": "7",
      "revelation_id": "Makkiyyah",
      "audio_full": {...}
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Detail Surah" 
            method="GET" 
            path="/surah?surahId=1" 
            category="quran"
            endpointId="detail-surah"
            responseJson={`{
  "status": 200,
  "data": {
    "number": "1",
    "sequence": "5",
    "number_of_verses": "7",
    "name_short": "الفاتحة",
    "name_long": "سُورَةُ ٱلْفَاتِحَةِ",
    "name_en": "Al-Faatiha",
    "name_id": "Al-Fatihah",
    "translation_en": "The Opening",
    "translation_id": "Pembukaan",
    "revelation": "مكة",
    "revelation_en": "Meccan",
    "revelation_id": "Makkiyyah",
    "tafsir": "...",
    "description": "...",
    "audio_url": "...",
    "audio_full": {
      "01": "https://cdn.equran.id/audio-full/Abdullah-Al-Juhany/001.mp3",
      "02": "https://cdn.equran.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
      "03": "https://cdn.equran.id/audio-full/Abdurrahman-as-Sudais/001.mp3",
      "04": "https://cdn.equran.id/audio-full/Ibrahim-Al-Dossari/001.mp3",
      "05": "https://cdn.equran.id/audio-full/Misyari-Rasyid-Al-Afasi/001.mp3",
      "06": "https://cdn.equran.id/audio-full/Yasser-Al-Dosari/001.mp3"
    }
  }
}`}
          />
          <ApiEndpoint 
            title="Tafsir Kemenag" 
            method="GET" 
            path="/tafsir?surahId=1" 
            category="quran"
            endpointId="tafsir"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "id": "1",
      "ayah": "1",
      "wajiz": "...",
      "tahlili": "..."
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Ayat by Surah" 
            method="GET" 
            path="/ayah/surah?surahId=1" 
            category="quran"
            endpointId="ayah-surah"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "id": "1",
      "surah": "1",
      "ayah": "1",
      "arab": "...",
      "latin": "...",
      "page": "1",
      "juz": "1",
      "hizb": null,
      "asbab": "0",
      "audio": "...",
      "audio_partial": {
        "01": "https://cdn.equran.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
        "02": "https://cdn.equran.id/audio-partial/Abdul-Muhsin-Al-Qasim/001001.mp3",
        "03": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3",
        "04": "https://cdn.equran.id/audio-partial/Ibrahim-Al-Dossari/001001.mp3",
        "05": "https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3",
        "06": "https://cdn.equran.id/audio-partial/Yasser-Al-Dosari/001001.mp3"
      },
      "theme": null,
      "text": "...",
      "notes": null
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Spesifik Ayat" 
            method="GET" 
            path="/ayah/specific?surahId=1&ayahId=1" 
            category="quran"
            endpointId="ayah-specific"
            responseJson={`{
  "status": 200,
  "data": {
    "id": "1",
    "surah": "1",
    "ayah": "1",
    "arab": "...",
    "latin": "...",
    "page": "1",
    "juz": "1",
    "hizb": null,
    "asbab": "0",
    "audio": "...",
    "audio_partial": {
      "01": "https://cdn.equran.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
      "02": "https://cdn.equran.id/audio-partial/Abdul-Muhsin-Al-Qasim/001001.mp3",
      "03": "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3",
      "04": "https://cdn.equran.id/audio-partial/Ibrahim-Al-Dossari/001001.mp3",
      "05": "https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3",
      "06": "https://cdn.equran.id/audio-partial/Yasser-Al-Dosari/001001.mp3"
    },
    "theme": null,
    "text": "...",
    "notes": null
  }
}`}
          />
          <ApiEndpoint 
            title="Ayat by Juz" 
            method="GET" 
            path="/ayah/juz?juzId=30" 
            category="quran"
            endpointId="ayah-juz"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Ayat by Page" 
            method="GET" 
            path="/ayah/page?page=604" 
            category="quran"
            endpointId="ayah-page"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Range Ayat" 
            method="GET" 
            path="/ayah/range?surahId=1&start=1&end=7" 
            category="quran"
            endpointId="ayah-range"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Cari Ayat" 
            method="GET" 
            path="/ayah/find?query=alhamdulillah" 
            category="quran"
            endpointId="ayah-find"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Juz Al-Quran" 
            method="GET" 
            path="/juz" 
            category="quran"
            endpointId="juz-list"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "number": "1",
      "name": "Juz 1"
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Detail Juz" 
            method="GET" 
            path="/juz?juzId=30" 
            category="quran"
            endpointId="juz-detail"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Tema Al-Quran" 
            method="GET" 
            path="/theme" 
            category="quran"
            endpointId="theme-list"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "id": "1",
      "name": "Tiga Golongan Manusia..."
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Detail Tema" 
            method="GET" 
            path="/theme?themeId=1" 
            category="quran"
            endpointId="theme-detail"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Al-Quran Kata per Kata" 
            method="GET" 
            path="/word?surahId=1" 
            category="quran"
            endpointId="word-ayah"
            responseJson={`{
  "status": 200,
  "data": [
    {
      "id": "id",
      "surah": "1",
      "ayah": "1",
      "word": "1",
      "arab": "بِسْمِ",
      "indo": "dengan nama"
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Word Spesifik Ayat" 
            method="GET" 
            path="/word?surahId=1&ayahId=1" 
            category="quran"
            endpointId="word-ayah"
            responseJson={`{
  "status": 200,
  "data": [...]
}`}
          />

          <SectionTitle 
            id="integrity" 
            title="Integrity & Blockchain" 
            icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            color="emerald"
          />
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm text-emerald-800 font-medium">
              🛡️ <strong>Data Integrity Proof:</strong> Kami menggunakan teknologi cryptographic hashing (SHA-256) untuk memastikan kemurnian teks Al-Quran. Setiap Surah dan Ayah memiliki "Digital Fingerprint" yang unik. Jika ada perubahan satu karakter saja pada database kami, maka hash integrity akan berubah, memberitahukan pengguna bahwa data tidak lagi murni.
            </p>
          </div>
          <ApiEndpoint 
            title="Integrity Chain (Blockchain)" 
            method="GET" 
            path="/integrity/chain" 
            category="integrity"
            endpointId="integrity-chain"
            responseJson={`{
  "status": 200,
  "message": "Data Integrity Chain (Proof of Authenticity)",
  "network": "Muslim-API Data Ledger",
  "root_hash": "4f8a...",
  "chain": [
    {
      "block_height": 1,
      "hash": "8d3e...",
      "surah_number": "1",
      "surah_name": "Al-Fatihah",
      "ayah_count": 7,
      "content_hash": "a1b2...",
      "previous_hash": "0000...",
      "timestamp": "2025-12-24T00:00:00Z"
    },
    ...
  ]
}`}
          />
          <ApiEndpoint 
            title="Verifikasi Ayah Spesifik" 
            method="GET" 
            path="/integrity/verify/ayah?surahId=1&ayahId=1" 
            category="integrity"
            endpointId="integrity-verify"
            responseJson={`{
  "status": 200,
  "data": {
    "surah": "1",
    "ayah": "1",
    "hash": "e3b0c442...",
    "verification_method": "SHA-256",
    "integrity": "Verified"
  }
}`}
          />

          {/* Other Resources Banner */}
          <div class="mb-20 p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl overflow-hidden relative group">
            <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-64 w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold mb-3">Butuh Resource Lainnya?</h3>
              <p class="text-emerald-50 mb-6 max-w-lg">
                Temukan API tambahan seperti Murottal, Jadwal Sholat, Kalender Hijriah, Hadits, Asmaul Husna, dan banyak lagi di halaman Resources.
              </p>
              <a 
                href="/other" 
                class="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Eksplor Other Resources
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <SectionTitle 
            id="faq" 
            title="Pertanyaan Umum" 
            icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            color="slate"
          />
          
          <div class="space-y-4 mb-20">
            {[
              {
                q: "Apa itu Muslim All-in-One API?",
                a: "Muslim All-in-One API adalah proyek open-source yang bertujuan menyediakan akses data keislaman (Al-Quran, Jadwal Sholat, Hadits, dll) dalam satu platform yang cepat, gratis, dan mudah digunakan oleh pengembang aplikasi."
              },
              {
                q: "Bagaimana keaslian dan akurasi data Al-Quran?",
                a: "Kami menjamin keaslian data Al-Quran dalam API ini. Data teks, terjemahan, dan tafsir (Wajiz & Tahlili) diwarisi dari dataset muslim-api-three milik Otang45 yang telah diverifikasi sesuai dengan database Kemenag RI. Struktur data kami mencakup Tafsir Tahlili yang sangat mendalam, yang merupakan produk intelektual resmi dari Kementerian Agama RI dan mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI)."
              },
              {
                q: "Bagaimana dengan performa dan keamanan?",
                a: "API ini sudah dilengkapi dengan 'Enterprise-grade Caching' (SWR) yang membuat respon sangat cepat lewat CDN. Kami juga menerapkan CORS policy and Rate Limiting untuk menjaga stabilitas server dari penggunaan berlebihan."
              },
              {
                q: "Apakah data ini sesuai dengan database Kemenag?",
                a: "Ya, benar. Secara teknis, dataset kami menggunakan skema 'Wajiz' dan 'Tahlili' yang hanya dimiliki oleh publikasi resmi Kemenag RI. Teks Arab yang digunakan juga mengikuti kaidah rasm utsmani standar Indonesia dengan tanda waqaf dan harakat yang telah disesuaikan untuk pengguna di Indonesia. Anda dapat membandingkan output API kami dengan situs resmi quran.kemenag.go.id untuk verifikasi mandiri."
              },
              {
                q: "Apakah data Hadits yang disediakan sahih?",
                a: "Untuk Hadits Arbain, kami menggunakan dataset dari muslim-api-three milik Otang45 yang telah terverifikasi. Untuk koleksi hadits besar (Bukhari, Muslim, dll), kami mengintegrasikan data dari api.hadith.gading.dev yang mengambil sumber dari kitab-kitab hadits terkemuka dengan teks Arab dan terjemahan Indonesia yang kredibel."
              },
              {
                q: "Dari mana sumber data lainnya?",
                a: "Jadwal sholat bersumber dari Kemenag RI (via MyQuran API). Dataset Al-Quran, Doa, dan Dzikir diwarisi dari project milik Otang45 (muslim-api-three). Audio murottal disediakan melalui CDN equran.id."
              },
              {
                q: "Bagaimana cara melakukan perubahan data atau memperbaiki typo?",
                a: "Data lokal seperti Al-Quran, Dzikir, dan Doa disimpan dalam database SQLite di `database/alquran.db`. Anda dapat melakukan koreksi langsung pada database tersebut menggunakan SQLite client. Berkat sistem Integrity & Blockchain kami, setiap perubahan pada teks Al-Quran akan secara otomatis mengubah 'Digital Fingerprint' (hash) pada sistem, sehingga transparansi data tetap terjaga."
              },
              {
                q: "Bagaimana jika saya menemukan kesalahan penulisan atau bug?",
                a: "Kami sangat menghargai laporan Anda. Jika Anda adalah pengguna API, silakan laporkan melalui Issue di repository GitHub kami. Jika Anda adalah pengembang, Anda dapat melakukan Pull Request atau memperbaiki data langsung di database lokal."
              },
              {
                q: "Apakah API ini gratis untuk digunakan?",
                a: "Ya, API ini 100% gratis untuk digunakan baik untuk proyek personal, pendidikan, maupun komersial tanpa perlu kunci API (API Key)."
              },
              {
                q: "Apakah ada batasan rate limit?",
                a: "Saat ini tidak ada batasan rate limit yang ketat, namun kami menyarankan untuk melakukan caching di sisi aplikasi Anda untuk performa terbaik dan menjaga keberlangsungan layanan."
              }
            ].map((faq, index) => (
              <details key={index} class="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span class="font-bold text-slate-900">{faq.q}</span>
                  <span class="text-emerald-500 transition-transform group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div class="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div class="bg-slate-900 rounded-3xl p-10 text-center text-white mb-20">
            <h2 class="text-3xl font-bold mb-4">Siap untuk Membangun?</h2>
            <p class="text-slate-400 mb-8 max-w-xl mx-auto">
              Mulai integrasikan Muslim API ke dalam aplikasi Anda hari ini. Gratis, cepat, dan terpercaya.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <a href="/playground" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
                Coba di Playground
              </a>
              <a href="https://github.com/vrush2000/muslim-all-in-one-api" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-slate-700">
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
