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
            onclick={`window.openApiModal('${category}', '${endpointId}', '/v1${path}')`}
            class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Try in Playground"
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

const SectionTitle = ({ title, icon, id, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-600 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
    amber: "bg-amber-600 shadow-amber-100",
    rose: "bg-rose-600 shadow-rose-100",
    purple: "bg-purple-600 shadow-purple-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
    slate: "bg-slate-600 shadow-slate-100"
  };

  return (
    <div id={id} class="flex items-center gap-3 mb-8 scroll-mt-24">
      <div class={`w-10 h-10 ${colorClasses[color] || colorClasses.emerald} rounded-lg flex items-center justify-center shadow-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

export const Other = () => {
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside class="hidden lg:block col-span-1 sticky top-28 self-start">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu Other API</h3>
            <nav class="space-y-1">
              {[
                { name: 'Murottal', href: '#murottal', icon: 'M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                { name: 'Sholat', href: '#sholat', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Kalender', href: '#calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { name: 'Hadits', href: '#hadits', icon: 'M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { name: 'Asmaul Husna', href: '#asma', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
                { name: 'Asbabun Nuzul', href: '#asbab', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                { name: 'Dzikir', href: '#dzikir', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
                { name: 'Doa-doa', href: '#doa', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                { name: 'Kemenag', href: '#kemenag', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { name: 'Sejarah', href: '#sejarah', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                { name: 'Juz & Tema', href: '#extra', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { name: 'Tools Cerdas', href: '#tools', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                { name: 'Resources', href: '#resources', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
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

        <div class="col-span-1 lg:col-span-3">
          <div class="max-w-3xl mb-12">
            <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Other Resources</h1>
            <p class="text-lg text-slate-600">
              Kumpulan resource dan API lainnya yang mungkin bermanfaat untuk pengembangan aplikasi Anda.
            </p>
          </div>

          <SectionTitle 
            id="murottal" 
            title="Murottal Audio" 
            icon="M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            color="emerald"
          />
          <ApiEndpoint 
            title="Daftar Qari" 
            method="GET" 
            path="/murotal/qari" 
            category="murottal"
            endpointId="murottal-qari"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan daftar qari.",
  "data": [
    {
      "id": "01",
      "name": "Abdullah-Al-Juhany"
    },
    ...
  ]
}`}
          />
          <ApiEndpoint 
            title="Murottal by Surah" 
            method="GET" 
            path="/murotal?surahId=1" 
            category="murottal"
            endpointId="murottal-surah"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan audio murottal surah 1.",
  "data": {
    "01": "https://cdn.equran.id/audio-full/Abdullah-Al-Juhany/001.mp3",
    "02": "https://cdn.equran.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
    ...
  }
}`}
          />

          <SectionTitle 
            id="sholat" 
            title="Jadwal Sholat" 
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            color="blue"
          />
          <ApiEndpoint 
            title="Cari Kota" 
            method="GET" 
            path="/sholat/kota/cari?nama=jakarta" 
            category="sholat"
            endpointId="sholat-cari-kota"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan daftar kota.",
  "data": [
    {
      "id": "1301",
      "lokasi": "KOTA JAKARTA"
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Jadwal by Kota ID" 
            method="GET" 
            path="/sholat/jadwal?kotaId=1301&tanggal=2025-12-24" 
            category="sholat"
            endpointId="sholat-jadwal-kota"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan jadwal sholat.",
  "data": {
    "id": "1301",
    "kabko": "KOTA JAKARTA",
    "prov": "DKI JAKARTA",
    "jadwal": {
      "2025-12-24": {
        "tanggal": "Rabu, 24/12/2025",
        "imsak": "04:05",
        "subuh": "04:15",
        "terbit": "05:34",
        "dhuha": "06:04",
        "dzuhur": "11:56",
        "ashar": "15:22",
        "maghrib": "18:10",
        "isya": "19:26"
      }
    }
  }
}`}
          />
          <ApiEndpoint 
            title="Jadwal by Koordinat" 
            method="GET" 
            path="/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272" 
            category="sholat"
            endpointId="sholat-jadwal-koordinat"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan jadwal sholat berdasarkan koordinat.",
  "data": {
    "location": "Monumen Nasional, Jalan Medan Merdeka Barat, Gambir, Jakarta Pusat",
    "city_found": "Jakarta Pusat",
    "id": "1301",
    "kabko": "KOTA JAKARTA",
    "prov": "DKI JAKARTA",
    "jadwal": {
      "2025-12-24": {
        "tanggal": "Rabu, 24/12/2025",
        "imsak": "04:05",
        "subuh": "04:15",
        "terbit": "05:34",
        "dhuha": "06:04",
        "dzuhur": "11:56",
        "ashar": "15:22",
        "maghrib": "18:10",
        "isya": "19:26"
      }
    }
  }
}`}
          />

          <SectionTitle 
            id="calendar" 
            title="Kalender Hijriah" 
            icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            color="emerald"
          />
          <ApiEndpoint 
            title="Masehi ke Hijriah & Jawa" 
            method="GET" 
            path="/calendar/hijri?date=2024-03-11&adj=-1" 
            category="other"
            endpointId="calendar-hijri"
            responseJson={`{
  "status": true,
  "message": "Berhasil konversi Masehi ke Hijriah.",
  "data": {
    "masehi": "2024-03-11",
    "adjustment": -1,
    "hijri": {
      "day": 1,
      "month": 9,
      "month_name": "Ramadan",
      ...
    }
  }
}`}
          />
          <ApiEndpoint 
            title="Hijriah ke Masehi" 
            method="GET" 
            path="/calendar/masehi?day=1&month=9&year=1445" 
            category="other"
            endpointId="calendar-masehi"
            responseJson={`{
  "status": true,
  "message": "Berhasil konversi Hijriah ke Masehi.",
  "data": {
    "hijri": {
      "day": 1,
      "month": 9,
      "year": 1445
    },
    "masehi": {
      "day": 11,
      "day_name": "Senin",
      "month": 3,
      "month_name": "Maret",
      "year": 2024,
      "formatted": "Senin, 11 Maret 2024"
    }
  }
}`}
          />

          <SectionTitle 
            id="hadits" 
            title="Hadits" 
            icon="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            color="orange"
          />
          <ApiEndpoint 
            title="Daftar Hadits Arbain" 
            method="GET" 
            path="/hadits" 
            category="hadits"
            endpointId="hadits-list"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan daftar hadits arbain.",
  "data": [
    {
      "id": 1,
      "no": "1",
      "judul": "Niat dan Ikhlas",
      "arab": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...",
      "indo": "Sesungguhnya setiap amal itu tergantung niatnya..."
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Daftar Kitab Hadits" 
            method="GET" 
            path="/hadits/books" 
            category="hadits"
            endpointId="hadits-books"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh koleksi kitab hadits.",
  "data": [
    { "name": "Abudaud", "id": "abu-daud", "available": 4419 },
    ...
  ]
}`}
          />

          <SectionTitle 
            id="asma" 
            title="Asmaul Husna" 
            icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" 
            color="indigo"
          />
          <ApiEndpoint 
            title="Semua Asmaul Husna" 
            method="GET" 
            path="/asma" 
            category="other"
            endpointId="asma-list"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar Asmaul Husna.",
  "data": [
    {
      "id": "1",
      "latin": "Ar-Rahman",
      "arabic": "الرحمن",
      "translation_id": "Yang Maha Pengasih"
    },
    ...
  ]
}`}
          />

          <SectionTitle 
            id="asbab" 
            title="Asbabun Nuzul" 
            icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            color="amber"
          />
          <ApiEndpoint 
            title="Daftar Asbabun Nuzul" 
            method="GET" 
            path="/asbab" 
            category="other"
            endpointId="asbab-list"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar asbabun nuzul.",
  "data": [
    {
      "id": "1",
      "surah": "1",
      "ayah": "1",
      "text": "..."
    },
    ...
  ]
}`}
          />

          <SectionTitle 
            id="dzikir" 
            title="Dzikir" 
            icon="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            color="indigo"
          />
          <ApiEndpoint 
            title="Daftar Dzikir" 
            method="GET" 
            path="/dzikir" 
            category="other"
            endpointId="dzikir"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar dzikir.",
  "data": [
    {
      "id": 1,
      "title": "Dzikir Pagi",
      "arabic": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ...",
      "translation": "Kami telah memasuki waktu pagi...",
      "type": "pagi"
    }
  ]
}`}
          />

          <SectionTitle 
            id="doa" 
            title="Doa-doa" 
            icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            color="rose"
          />
          <ApiEndpoint 
            title="Daftar Doa" 
            method="GET" 
            path="/doa" 
            category="other"
            endpointId="doa-list"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar doa.",
  "data": [
    {
      "id": 1,
      "judul": "Doa Sebelum Makan",
      "arab": "...",
      "latin": "...",
      "indo": "..."
    }
  ]
}`}
          />

          <SectionTitle 
            id="extra" 
            title="Juz, Tema & Word" 
            icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            color="slate"
          />
          <ApiEndpoint 
            title="Juz Al-Quran" 
            method="GET" 
            path="/juz" 
            category="quran"
            endpointId="juz-list"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan daftar juz.", "data": [...] }`}
          />
          <ApiEndpoint 
            title="Tema Al-Quran" 
            method="GET" 
            path="/theme" 
            category="quran"
            endpointId="theme-list"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan daftar tema Al-Quran.", "data": [...] }`}
          />
          <ApiEndpoint 
            title="Kata per Kata" 
            method="GET" 
            path="/word?surahId=1" 
            category="quran"
            endpointId="word-ayah"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan data kata per kata surah 1.", "data": [...] }`}
          />

          <SectionTitle 
            id="kemenag" 
            title="Layanan Kemenag" 
            icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            color="emerald"
          />
          <ApiEndpoint 
            title="Daftar Masjid & Mushalla (Source: SIMAS)" 
            method="GET" 
            path="/kemenag/masjid" 
            category="kemenag"
            endpointId="kemenag-masjid-list"
            responseJson={`{
  "status": true,
  "message": "Data masjid/mushalla berhasil diambil (Source: SIMAS Kemenag)",
  "total_data_source": "317.218 Masjid",
  "data": [
    {
      "id": 1,
      "nama": "Masjid Istiqlal",
      "jenis": "Masjid",
      "tipologi": "Nasional",
      "lokasi": "Jakarta Pusat, DKI Jakarta",
      "kapasitas": "200.000",
      "tahun_berdiri": "1978",
      "deskripsi": "Masjid terbesar di Asia Tenggara."
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Filter Masjid/Mushalla" 
            method="GET" 
            path="/kemenag/masjid?jenis=Masjid&tipologi=Agung&lokasi=semarang" 
            category="kemenag"
            endpointId="kemenag-masjid-search"
            responseJson={`{
  "status": true,
  "message": "Data masjid/mushalla berhasil diambil (Source: SIMAS Kemenag)",
  "total_data_source": "317.218 Masjid",
  "data": [
    {
      "id": 5,
      "nama": "Masjid Agung Jawa Tengah",
      "jenis": "Masjid",
      "tipologi": "Agung",
      "lokasi": "Semarang, Jawa Tengah",
      "kapasitas": "15.000",
      "tahun_berdiri": "2006",
      "deskripsi": "Masjid dengan payung hidrolik raksasa seperti di Nabawi."
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Hari Libur Nasional" 
            method="GET" 
            path="/kemenag/libur?year=2025" 
            category="kemenag"
            endpointId="kemenag-libur"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan daftar hari libur tahun 2025.",
  "data": {
    "year": "2025",
    "holidays": [
      {
        "tanggal": "2025-01-01",
        "keterangan": "Tahun Baru 2025 Masehi",
        "is_cuti": false
      }
    ]
  }
}`}
          />
          <ApiEndpoint 
            title="Daftar Provinsi (Pesantren)" 
            method="GET" 
            path="/kemenag/provinsi" 
            category="kemenag"
            endpointId="kemenag-provinsi"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan daftar provinsi.", "data": [...] }`}
          />
          <ApiEndpoint 
            title="Daftar Kabupaten (Pesantren)" 
            method="GET" 
            path="/kemenag/kabupaten?provinsiId=32" 
            category="kemenag"
            endpointId="kemenag-kabupaten"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan daftar kabupaten untuk provinsi 32.", "data": [...] }`}
          />
          <ApiEndpoint 
            title="Daftar Pesantren" 
            method="GET" 
            path="/kemenag/pesantren?kabupatenId=3201" 
            category="kemenag"
            endpointId="kemenag-pesantren"
            responseJson={`{ "status": true, "message": "Berhasil mendapatkan daftar pesantren untuk kabupaten 3201.", "data": [...] }`}
          />

          <SectionTitle 
            id="sejarah" 
            title="Sejarah Islam" 
            icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            color="blue"
          />
          <ApiEndpoint 
            title="Sejarah Islam & Sirah Nabawiyah" 
            method="GET" 
            path="/sejarah" 
            category="sejarah"
            endpointId="sejarah-list"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan seluruh daftar sejarah.",
  "data": [
    {
      "id": 1,
      "peristiwa": "Kelahiran Nabi Muhammad SAW",
      "tahun": "571 M",
      "kategori": "Sirah Nabawiyah",
      "sumber": "Ar-Rahiq Al-Makhtum"
    },
    ...
  ]
}`}
          />
          <ApiEndpoint 
            title="Detail Peristiwa Sejarah" 
            method="GET" 
            path="/sejarah/detail?id=1" 
            category="sejarah" 
            endpointId="sejarah-detail" 
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan detail sejarah.",
  "data": {
    "id": 1,
    "peristiwa": "Kelahiran Nabi Muhammad SAW",
    "tahun": "571 M (Tahun Gajah)",
    "deskripsi": "...",
    "kategori": "Sirah Nabawiyah",
    "sumber": "Ar-Rahiq Al-Makhtum"
  }
}`}
          />

          <SectionTitle 
            id="tools" 
            title="Tools & Fitur Cerdas" 
            icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            color="purple"
          />
          <ApiEndpoint 
            title="Kutipan Harian (Ayat & Hadits)" 
            method="GET" 
            path="/tools/quotes/daily" 
            category="tools"
            endpointId="tools-quotes-daily"
            responseJson={`{
  "status": true,
  "message": "Berhasil mengambil kutipan harian.",
  "data": {
    "ayat": {
      "arab": "...",
      "text": "...",
      "sumber": "QS. Al-Baqarah: 153"
    },
    "hadits": {
      "arab": "...",
      "text": "...",
      "sumber": "HR. Bukhari"
    }
  }
}`}
          />
          <ApiEndpoint 
            title="Kalkulator Zakat" 
            method="GET" 
            path="/tools/zakat?type=maal&amount=100000000" 
            category="tools"
            endpointId="tools-zakat"
            responseJson={`{
  "status": true,
  "message": "Kalkulasi zakat berhasil.",
  "data": {
    "type": "maal",
    "amount": 100000000,
    "nishab": 85000000,
    "isWajib": true,
    "zakat": 2500000,
    "keterangan": "Nishab Zakat Maal adalah setara 85 gram emas per tahun. Tarif zakat 2,5%."
  }
}`}
          />
          <ApiEndpoint 
            title="Arah Kiblat (Qibla Direction)" 
            method="GET" 
            path="/tools/qibla?lat=-6.1751&lng=106.8272" 
            category="tools"
            endpointId="tools-qibla"
            responseJson={`{
  "status": true,
  "message": "Berhasil menghitung arah kiblat.",
  "data": {
    "coordinates": { "lat": -6.1751, "lng": 106.8272 },
    "kaaba": { "lat": 21.4225, "lng": 39.8262 },
    "qibla_direction": 295.12,
    "unit": "degrees"
  }
}`}
          />
          <ApiEndpoint 
            title="Pencarian Semantik (AI Search)" 
            method="GET" 
            path="/tools/semantic-search?query=sabar" 
            category="tools"
            endpointId="tools-semantic-search"
            responseJson={`{
  "status": true,
  "message": "Pencarian semantik untuk 'sabar' berhasil.",
  "data": {
    "query": "sabar",
    "quran": [
      {
        "arab": "...",
        "text": "...",
        "sumber": "..."
      },
      "..."
    ],
    "hadits": [
      {
        "arab": "...",
        "text": "...",
        "sumber": "..."
      },
      "..."
    ]
  }
}`}
          />

          <SectionTitle 
            id="resources" 
            title="Resources" 
            icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
            color="slate"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {[
              { name: 'GitHub Repository', url: 'https://github.com/vrush2000/muslim-all-in-one-api', desc: 'Source code and documentation' },
              { name: 'Quran Kemenag', url: 'https://quran.kemenag.go.id/', desc: 'Official Quran data from Kemenag RI' },
              { name: 'MyQuran (Prayer Times)', url: 'https://api.myquran.com/', desc: 'Prayer times and Islamic schedule API' },
              { name: 'equran.id (Audio)', url: 'https://equran.id/', desc: 'Quran audio and digital text' },
              { name: 'Muslim API Dataset (Repo)', url: 'https://github.com/Otangid/muslim-api', desc: 'Alternative Muslim API provider' },
              { name: 'Hadith Collection (Repo)', url: 'https://github.com/gadingnst/hadith-api', desc: 'Comprehensive Hadith collection API' },
              { name: 'Data Pesantren (Repo)', url: 'https://github.com/nasrul21/data-pesantren-indonesia', desc: 'Database pesantren se-Indonesia (Source)' },
              { name: 'Libur Nasional (Repo)', url: 'https://github.com/kresnasatya/api-harilibur', desc: 'Data hari libur nasional Indonesia (Source)' },
            ].map((resource) => (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{resource.name}</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">{resource.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
