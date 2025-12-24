/** @jsx jsx */
import { jsx } from 'hono/jsx'

const ApiEndpoint = ({ method, path, title, responseJson }) => (
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
                { name: 'Juz & Tema', href: '#extra', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": true,
  "message": "success",
  "data": [
    {
      "id": "58a2fc6ed39fd083f55d4182bf88826d",
      "lokasi": "KOTA JAKARTA"
    }
  ]
}`}
          />
          <ApiEndpoint 
            title="Jadwal by Kota ID" 
            method="GET" 
            path="/sholat/jadwal?kotaId=58a2fc6ed39fd083f55d4182bf88826d&tanggal=2025-12-24" 
            responseJson={`{
  "status": true,
  "message": "success",
  "data": {
    "id": "58a2fc6ed39fd083f55d4182bf88826d",
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
            responseJson={`{
  "status": 200,
  "location": "Monumen Nasional, Jalan Medan Merdeka Barat, Gambir, Jakarta Pusat",
  "city_found": "Jakarta Pusat",
  "data": {
    "id": "58a2fc6ed39fd083f55d4182bf88826d",
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "code": 200,
  "message": "Success fetching all collections",
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{
  "status": 200,
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
            responseJson={`{ "status": 200, "data": [...] }`}
          />
          <ApiEndpoint 
            title="Tema Al-Quran" 
            method="GET" 
            path="/theme" 
            responseJson={`{ "status": 200, "data": [...] }`}
          />
          <ApiEndpoint 
            title="Kata per Kata" 
            method="GET" 
            path="/word?surahId=1" 
            responseJson={`{ "status": 200, "data": [...] }`}
          />
        </div>
      </div>
    </div>
  )
}

