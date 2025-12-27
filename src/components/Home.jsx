/** @jsx jsx */
import { jsx } from 'hono/jsx'

const ApiEndpoint = ({ method, path, title, responseJson, category, endpointId }) => (
  <div class="overflow-hidden mb-8 bg-white rounded-xl border shadow-sm transition-all duration-300 border-slate-200 hover:shadow-md">
    <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
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
      <div class="flex gap-2 items-center mb-6 group">
        <div class="flex flex-grow gap-2 items-center px-3 py-2 rounded-lg border transition-colors bg-slate-100 border-slate-200 group-hover:border-emerald-200">
          <code class="font-mono text-sm truncate text-slate-600">{path}</code>
        </div>
        <div class="flex gap-2">
          <button 
            onclick={`window.openApiModal('${category}', '${endpointId}', '/v1${path}')`}
            class="p-2 rounded-lg transition-all text-slate-400 hover:text-blue-600 hover:bg-blue-50"
            title="Try in Playground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            onclick={`navigator.clipboard.writeText(window.location.origin + '/v1${path}')`}
            class="p-2 rounded-lg transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            title="Copy URL"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="space-y-4">
        <details class="group">
          <summary class="flex gap-2 items-center text-sm font-medium list-none transition-colors cursor-pointer text-slate-500 hover:text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            Example Response
          </summary>
          <div class="mt-4 duration-300 animate-in fade-in slide-in-from-top-2">
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
  <div id={id} class="flex gap-3 items-center mb-8 scroll-mt-24">
    <div class={`flex justify-center items-center w-10 h-10 rounded-lg shadow-lg bg-${color}-600 shadow-${color}-100`}>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-slate-900">{title}</h2>
  </div>
)

export const Home = ({ baseUrl }) => {
  return (
    <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Sidebar */}
        <aside class="hidden sticky top-28 col-span-1 self-start lg:block">
          <div class="p-6 bg-white rounded-2xl border shadow-sm border-slate-200">
            <h3 class="px-3 mb-4 text-xs font-bold tracking-wider uppercase text-slate-400">Menu</h3>
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
                  class="flex gap-3 items-center px-3 py-2 text-sm font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-colors text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div class="inline-flex gap-2 items-center px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
                <span class="flex relative w-2 h-2">
                  <span class="inline-flex absolute w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping"></span>
                  <span class="inline-flex relative w-2 h-2 bg-emerald-500 rounded-full"></span>
                </span>
                v1.0.0 Stable
              </div>
              <div class="inline-flex gap-2 items-center px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z" />
                </svg>
                Verified Data Source: Kemenag RI
              </div>
            </div>
            <h1 class="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900">
              Muslim <span class="block text-emerald-600 md:inline">All-in-One API</span>
            </h1>
            <p class="mb-10 max-w-3xl text-xl leading-relaxed text-slate-600">
              Akses data keislaman terlengkap dengan performa tinggi. Dibangun untuk pengembang yang ingin membuat aplikasi islami.
            </p>
            
            <div class="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2">
              <div class="p-6 bg-white rounded-2xl border shadow-sm border-slate-200">
                <div class="flex justify-center items-center mb-4 w-10 h-10 text-emerald-600 bg-emerald-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 class="mb-2 font-bold text-slate-900">Base URL</h3>
                <div class="flex gap-2 justify-between items-center p-2 rounded-lg border bg-slate-50 border-slate-100 group">
                  <code class="font-mono text-sm font-bold text-emerald-600 truncate">{baseUrl}</code>
                  <button 
                    onclick={`navigator.clipboard.writeText('${baseUrl}')`}
                    class="p-1.5 rounded-md transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 shrink-0"
                    title="Copy Base URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="p-6 bg-white rounded-2xl border shadow-sm border-slate-200">
                <div class="flex justify-center items-center mb-4 w-10 h-10 text-blue-600 bg-blue-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="mb-2 font-bold text-slate-900">Format</h3>
                <div class="flex gap-2 items-center p-2 rounded-lg border bg-slate-50 border-slate-100">
                  <code class="font-mono text-sm font-bold text-blue-600">application/json</code>
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
  "status": true,
  "message": "Berhasil mendapatkan daftar surah.",
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
  "status": true,
  "message": "Berhasil mendapatkan detail surah Al-Fatihah.",
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
      ...
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
  "status": true,
  "message": "Berhasil mendapatkan tafsir surah 1.",
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
  "status": true,
  "message": "Berhasil mendapatkan daftar seluruh ayat surah 1.",
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
        ...
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
  "status": true,
  "message": "Berhasil mendapatkan ayat 1 surah 1.",
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
      ...
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
  "status": true,
  "message": "Berhasil mendapatkan seluruh ayat pada juz 30.",
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
  "status": true,
  "message": "Berhasil mendapatkan seluruh ayat pada halaman 604.",
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
  "status": true,
  "message": "Berhasil mendapatkan ayat surah 1 dari ayat 1 sampai 7.",
  "data": [...]
}`}
          />
          <ApiEndpoint 
            title="Cari Ayat" 
            method="GET" 
            path="/ayah/find?query=puasa" 
            category="quran"
            endpointId="ayah-find"
            responseJson={`{
  "status": true,
  "message": "Berhasil mencari ayat dengan kata kunci 'puasa'.",
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
  "status": true,
  "message": "Berhasil mendapatkan daftar juz.",
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
  "status": true,
  "message": "Berhasil mendapatkan informasi juz 30.",
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
  "status": true,
  "message": "Berhasil mendapatkan daftar tema Al-Quran.",
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
  "status": true,
  "message": "Berhasil mendapatkan ayat dengan tema 1.",
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
  "status": true,
  "message": "Berhasil mendapatkan data kata per kata surah 1.",
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
            endpointId="word-ayah-specific"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan data kata per kata surah 1 ayat 1.",
  "data": [...]
}`}
          />

          <SectionTitle 
            id="integrity" 
            title="Integrity Chain" 
            icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            color="emerald"
          />
          <div className="p-4 mb-6 bg-emerald-50 rounded-r-lg border-l-4 border-emerald-500">
            <p className="text-sm font-medium text-emerald-800">
              🛡️ <strong>Data Integrity Proof:</strong> Kami menggunakan teknologi cryptographic hashing (SHA-256) untuk memastikan kemurnian teks Al-Quran. Setiap Surah dan Ayah memiliki "Digital Fingerprint" yang unik. Jika ada perubahan satu karakter saja pada data kami, maka hash integrity akan berubah, memberitahukan pengguna bahwa data tidak lagi murni.
            </p>
          </div>
          <ApiEndpoint 
            title="Integrity Chain (Proof of Authenticity)" 
            method="GET" 
            path="/integrity/chain" 
            category="integrity"
            endpointId="integrity-chain"
            responseJson={`{
  "status": true,
  "message": "Data Integrity Chain (Proof of Authenticity) berhasil dibuat.",
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
  "status": true,
  "message": "Berhasil memverifikasi integritas ayat 1 pada surah 1.",
  "data": {
    "surahId": "1",
    "ayahId": "1",
    "local_data": {
      "arab": "بِسْمِ اللَّهِ الر" + "َحْمَٰنِ الرَّحِيمِ",
      "text": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
    },
    "hash": "e3b0c442...",
    "comparison": {
      "status": "Success",
      "source": "Kemenag (via EQuran.id)",
      "is_match": true,
      "details": {
        "arab_match": true,
        "translation_match": true
      },
      "external_data": {
        "arab": "بِسْمِ اللَّهِ الر" + "َحْمَٰنِ الرَّحِيمِ",
        "text": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
      }
    },
    "external_verification_url": "https://quran.kemenag.go.id/quran/per-ayat/surah/1?from=1&to=1",
    "timestamp": "2025-12-24T00:00:00Z"
  }
}`}
          />

          <ApiEndpoint 
            title="Kalkulator Zakat" 
            method="GET" 
            path="/tools/zakat?type=maal&amount=100000000&hargaEmas=1200000" 
            category="tools"
            endpointId="tools-zakat"
            responseJson={`{
  "status": true,
  "message": "Kalkulasi zakat berhasil.",
  "data": {
    "type": "maal",
    "amount": 100000000,
    "nishab": 102000000,
    "isWajib": false,
    "zakat": 0,
    "keterangan": "Nishab Zakat Maal adalah setara 85 gram emas per tahun. Tarif zakat 2,5%."
  }
}`}
          />

          {/* Analytics Category */}
          <div class="mt-12 mb-6">
            <h3 class="pl-4 text-2xl font-bold text-emerald-800 border-l-4 border-emerald-500">
              Spiritual Analytics (Global)
            </h3>
            <p class="mt-2 text-slate-600">
              Statistik penggunaan global untuk melihat tren pembacaan Al-Qur'an dan laporan khatam kolektif.
            </p>
          </div>

          <ApiEndpoint 
            title="Global Analytics" 
            method="GET" 
            path="/analytics" 
            category="analytics"
            endpointId="analytics-global"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan statistik spiritual global.",
  "data": {
    "total_reads": 1250,
    "global_khatam_count": 5,
    "trending_surahs": [
      { "id": "1", "name": "Al-Fatihah", "reads": 450 },
      { "id": "18", "name": "Al-Kahf", "reads": 320 }
    ],
    "last_updated": "2025-12-24T00:00:00Z"
  }
}`}
          />

          <ApiEndpoint 
            title="Lapor Khatam (Post)" 
            method="POST" 
            path="/analytics/khatam" 
            category="analytics"
            endpointId="analytics-khatam"
            responseJson={`{
  "status": true,
  "message": "Alhamdulillah! Satu khatam baru telah tercatat dalam statistik global. Semoga berkah."
}`}
          />

          <div class="p-8 mb-20 bg-white rounded-2xl border shadow-sm border-slate-200">
            <h3 class="flex gap-2 items-center mb-4 text-xl font-bold text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Transparansi & Verifikasi Mandiri
            </h3>
            <p class="mb-6 text-slate-600">
              Kami percaya bahwa kepercayaan dibangun di atas transparansi. Anda tidak perlu hanya percaya pada klaim kami; Anda dapat memverifikasi keaslian data Al-Quran secara mandiri menggunakan metode standar industri.
            </p>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="p-5 rounded-xl bg-slate-50">
                <h4 class="mb-3 font-bold text-slate-900">Metode Verifikasi</h4>
                <ul class="space-y-3 text-sm text-slate-600">
                  <li class="flex gap-2">
                    <span class="font-bold text-emerald-600">1.</span>
                    Ambil data mentah (raw data) dari endpoint <code class="px-1 bg-white rounded border">/v1/ayah/surah?surahId=1</code>
                  </li>
                  <li class="flex gap-2">
                    <span class="font-bold text-emerald-600">2.</span>
                    Ekstrak hanya field <code class="px-1 bg-white rounded border">arab</code> dan <code class="px-1 bg-white rounded border">text</code> untuk setiap ayat.
                  </li>
                  <li class="flex gap-2">
                    <span class="font-bold text-emerald-600">3.</span>
                    Lakukan hashing SHA-256 pada array objek tersebut.
                  </li>
                  <li class="flex gap-2">
                    <span class="font-bold text-emerald-600">4.</span>
                    Bandingkan hasilnya dengan <code class="px-1 bg-white rounded border">content_hash</code> di <code class="px-1 bg-white rounded border">/v1/integrity/chain</code>.
                  </li>
                </ul>
              </div>
              
              <div class="p-5 rounded-xl bg-slate-50">
                <h4 class="mb-3 font-bold text-slate-900">Algoritma Hashing</h4>
                <p class="mb-4 text-sm text-slate-600">
                  Kami menggunakan algoritma SHA-256 yang standar dan tidak dapat dimanipulasi. Berikut adalah contoh snippet kode Node.js untuk verifikasi:
                </p>
                <div class="p-3 rounded-lg bg-slate-900">
                  <pre class="text-[10px] text-emerald-400 overflow-x-auto">
{`const crypto = require('crypto');
const data = ayahs.map(a => ({ arab: a.arab, text: a.text }));
const hash = crypto.createHash('sha256')
  .update(JSON.stringify(data))
  .digest('hex');`}
                  </pre>
                </div>
              </div>
            </div>
            
            <div class="p-4 mt-6 rounded-xl border border-blue-100 bg-blue-50/50">
              <p class="text-xs leading-relaxed text-blue-700">
                <strong>Catatan Keamanan:</strong> Struktur rantai integritas kami (Integrity Chain) juga menyertakan <code class="px-1 bg-blue-100 rounded">previous_hash</code>, yang berarti jika satu Surah diubah, seluruh rantai setelahnya akan menjadi tidak valid. Ini adalah mekanisme yang sama yang digunakan oleh teknologi blockchain untuk menjamin imutabilitas data.
              </p>
            </div>
          </div>

          {/* Other Resources Banner */}
          <div class="overflow-hidden relative p-8 mb-20 text-white bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-xl group">
            <div class="absolute -right-10 -bottom-10 opacity-10 transition-transform duration-500 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="relative z-10">
              <h3 class="mb-3 text-2xl font-bold">Butuh Resource Lainnya?</h3>
              <p class="mb-6 max-w-lg text-emerald-50">
                Temukan API tambahan seperti Murottal, Jadwal Sholat, Kalender Hijriah, Hadits, Asmaul Husna, dan banyak lagi di halaman Resources.
              </p>
              <a 
                href="/other" 
                class="inline-flex gap-2 items-center px-6 py-3 font-bold text-emerald-700 bg-white rounded-xl shadow-lg transition-colors hover:bg-emerald-50"
              >
                Eksplor Other Resources
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          
          <div class="mb-20 space-y-4">
            {[
              {
                q: "Apa itu Muslim All-in-One API?",
                a: "Muslim All-in-One API adalah proyek open-source yang bertujuan menyediakan akses data keislaman (Al-Quran, Jadwal Sholat, Hadits, dll) dalam satu platform yang cepat, gratis, dan mudah digunakan oleh pengembang aplikasi."
              },
              {
                q: "Bagaimana keaslian dan akurasi data Al-Quran?",
                a: "Kami menjamin keaslian data Al-Quran dalam API ini. Data teks, terjemahan, dan tafsir (Wajiz & Tahlili) diwarisi dari dataset muslim-api-three milik Otangid yang telah diverifikasi sesuai dengan data resmi Kemenag RI. Struktur data kami mencakup Tafsir Tahlili yang sangat mendalam, yang merupakan produk intelektual resmi dari Kementerian Agama RI dan mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI)."
              },
              {
                q: "Bagaimana dengan performa dan keamanan?",
                a: "API ini sudah dilengkapi dengan 'Enterprise-grade Caching' (SWR) yang membuat respon sangat cepat lewat CDN. Kami juga menerapkan CORS policy and Rate Limiting untuk menjaga stabilitas server dari penggunaan berlebihan."
              },
              {
                q: "Apakah data ini sesuai dengan sumber resmi Kemenag?",
                a: "Ya, benar. Secara teknis, dataset kami menggunakan skema 'Wajiz' dan 'Tahlili' yang hanya dimiliki oleh publikasi resmi Kemenag RI. Teks Arab yang digunakan juga mengikuti kaidah rasm utsmani standar Indonesia dengan tanda waqaf dan harakat yang telah disesuaikan untuk pengguna di Indonesia. Anda dapat membandingkan output API kami dengan situs resmi quran.kemenag.go.id untuk verifikasi mandiri."
              },
              {
                q: "Apakah data Hadits yang disediakan sahih?",
                a: "Untuk Hadits Arbain, kami menggunakan dataset dari muslim-api-three milik Otangid yang telah terverifikasi. Untuk koleksi hadits besar (Bukhari, Muslim, dll), kami mengintegrasikan data dari api.hadith.gading.dev yang mengambil sumber dari kitab-kitab hadits terkemuka dengan teks Arab dan terjemahan Indonesia yang kredibel."
              },
              {
                q: "Dari mana sumber data lainnya?",
                a: "Jadwal sholat bersumber dari Kemenag RI (via MyQuran API). Dataset Al-Quran, Doa, dan Dzikir diwarisi dari project milik Otangid (muslim-api-three). Audio murottal disediakan melalui CDN equran.id."
              },
              {
                q: "Bagaimana jika saya menemukan perbedaan dengan mushaf resmi Kemenag?",
                a: "Meskipun kami berusaha 100% akurat, kesalahan manusia dalam entry data bisa saja terjadi. Jika Anda menemukan perbedaan teks atau tanda baca dengan quran.kemenag.go.id, silakan laporkan melalui GitHub Issues. Kami menyediakan endpoint Admin khusus untuk melakukan koreksi instan secara lokal sebelum di-push ke server, sehingga perbaikan dapat dilakukan dengan sangat cepat tanpa menunggu siklus rilis yang lama."
              },
              {
                q: "Bagaimana cara melakukan perubahan data atau memperbaiki typo?",
                a: "Data lokal seperti Al-Quran, Dzikir, dan Doa disimpan dalam format JSON di folder `src/data`. Anda dapat melakukan koreksi langsung pada file tersebut. Berkat sistem Integrity Chain kami, setiap perubahan pada teks Al-Quran akan secara otomatis mengubah 'Digital Fingerprint' (hash) pada sistem, sehingga transparansi data tetap terjaga."
              },
              {
                q: "Bagaimana jika saya menemukan kesalahan penulisan atau bug?",
                a: "Kami sangat menghargai laporan Anda. Jika Anda adalah pengguna API, silakan laporkan melalui Issue di repository GitHub kami. Jika Anda adalah pengembang, Anda dapat melakukan Pull Request atau memperbaiki data langsung di file JSON lokal."
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
              <details key={index} class="overflow-hidden bg-white rounded-2xl border shadow-sm group border-slate-200">
                <summary class="flex justify-between items-center p-6 list-none cursor-pointer">
                  <span class="font-bold text-slate-900">{faq.q}</span>
                  <span class="text-emerald-500 transition-transform group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div class="px-6 pt-4 pb-6 leading-relaxed border-t text-slate-600 border-slate-50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div class="p-10 mb-20 text-center text-white rounded-3xl bg-slate-900">
            <h2 class="mb-4 text-3xl font-bold">Siap untuk Membangun?</h2>
            <p class="mx-auto mb-8 max-w-xl text-slate-400">
              Mulai integrasikan Muslim API ke dalam aplikasi Anda hari ini. Gratis, cepat, dan terpercaya.
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <a href="/playground" class="px-8 py-3 font-bold text-white bg-emerald-600 rounded-xl shadow-lg transition-all hover:bg-emerald-700 shadow-emerald-900/20">
                Coba di Playground
              </a>
              <a href="https://github.com/vrush2000/muslim-all-in-one-api" target="_blank" class="px-8 py-3 font-bold text-white rounded-xl border transition-all bg-slate-800 hover:bg-slate-700 border-slate-700">
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
