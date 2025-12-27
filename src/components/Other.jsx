/** @jsx jsx */
import { jsx } from "hono/jsx";

const ApiEndpoint = ({
  method,
  path,
  title,
  responseJson,
  category,
  endpointId,
}) => (
  <div class="overflow-hidden mb-8 bg-white rounded-xl border shadow-sm transition-all duration-300 border-slate-200 hover:shadow-md">
    <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <h4 class="font-semibold text-slate-900">{title}</h4>
      <div class="flex gap-2">
        <span
          class={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            method === "GET"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            onclick={`navigator.clipboard.writeText(window.location.origin + '/v1${path}')`}
            class="p-2 rounded-lg transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            title="Copy URL"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <details class="group">
          <summary class="flex gap-2 items-center text-sm font-medium list-none transition-colors cursor-pointer text-slate-500 hover:text-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
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
);

const SectionTitle = ({ title, icon, id, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-600 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
    amber: "bg-amber-600 shadow-amber-100",
    rose: "bg-rose-600 shadow-rose-100",
    purple: "bg-purple-600 shadow-purple-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
    slate: "bg-slate-600 shadow-slate-100",
  };

  return (
    <div id={id} class="flex gap-3 items-center mb-8 scroll-mt-24">
      <div
        class={`w-10 h-10 ${
          colorClasses[color] || colorClasses.emerald
        } rounded-lg flex items-center justify-center shadow-lg`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d={icon}
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
};

export const Other = () => {
  return (
    <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Sidebar */}
        <aside class="hidden sticky top-28 col-span-1 self-start lg:block">
          <div class="p-6 bg-white rounded-2xl border shadow-sm border-slate-200">
            <h3 class="px-3 mb-4 text-xs font-bold tracking-wider uppercase text-slate-400">
              Menu Other API
            </h3>
            <nav class="space-y-1">
              {[
                {
                  name: "Murottal",
                  href: "#murottal",
                  icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                },
                {
                  name: "Sholat",
                  href: "#sholat",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  name: "Kalender",
                  href: "#calendar",
                  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
                {
                  name: "Hadits",
                  href: "#hadits",
                  icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
                {
                  name: "Asmaul Husna",
                  href: "#asma",
                  icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z",
                },
                {
                  name: "Asbabun Nuzul",
                  href: "#asbab",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
                {
                  name: "Dzikir",
                  href: "#dzikir",
                  icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
                },
                {
                  name: "Doa-doa",
                  href: "#doa",
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                },
                {
                  name: "Kemenag",
                  href: "#kemenag",
                  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                },
                {
                  name: "Sejarah",
                  href: "#sejarah",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
                {
                  name: "Puasa Sunnah",
                  href: "#puasa",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  name: "Juz & Tema",
                  href: "#extra",
                  icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                },
                {
                  name: "Tools Cerdas",
                  href: "#tools",
                  icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                },
                {
                  name: "Widget Dashboard",
                  href: "#widgets",
                  icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
                },
                {
                  name: "Resources",
                  href: "#resources",
                  icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  class="flex gap-3 items-center px-3 py-2 text-sm font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 transition-colors text-slate-400 group-hover:text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d={item.icon}
                    />
                  </svg>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div class="col-span-1 lg:col-span-3">
          <div class="mb-12 max-w-3xl">
            <h1 class="mb-4 text-4xl font-extrabold tracking-tight text-slate-900">
              Other Resources
            </h1>
            <p class="text-lg text-slate-600">
              Kumpulan resource dan API lainnya yang mungkin bermanfaat untuk
              pengembangan aplikasi Anda.
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
            title="Cari Hadits (Query)"
            method="GET"
            path="/hadits/find?query=puasa&book=bukhari"
            category="hadits"
            endpointId="hadits-find"
            responseJson={`{
  "status": true,
  "message": "Berhasil mencari hadits di kitab Sahih Bukhari dengan kata kunci: puasa.",
  "data": [
    {
      "no": 1901,
      "judul": "Sahih Bukhari",
      "arab": "...",
      "indo": "...",
      "sumber": "HR. Bukhari No. 1901"
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
    { "id": "arbain", "name": "Hadits Arbain Nawawi", "available": 42 },
    { "id": "bukhari", "name": "HR. Bukhari", "available": "Lokal (JSON)" },
    { "id": "muslim", "name": "HR. Muslim", "available": "Lokal (JSON)" }
  ]
}`}
          />
          <ApiEndpoint
            title="Detail Hadits per Kitab"
            method="GET"
            path="/hadits/books/bukhari/1"
            category="hadits"
            endpointId="hadits-book-detail"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan detail hadits nomor 1 dari kitab Sahih Bukhari.",
  "data": {
    "number": 1,
    "arab": "...",
    "id": "Semua perbuatan tergantung niatnya...",
    "name": "HR. Bukhari"
  }
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
            id="puasa"
            title="Puasa & Fiqh"
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            color="emerald"
          />
          <ApiEndpoint
            title="Daftar Puasa (Wajib & Sunnah)"
            method="GET"
            path="/puasa"
            category="puasa"
            endpointId="puasa-all"
            responseJson={`{
  "status": true,
  "message": "Berhasil mengambil daftar puasa.",
  "data": [
    {
      "id": 1,
      "nama": "Puasa Senin Kamis",
      "deskripsi": "Puasa sunnah yang dilaksanakan pada hari Senin dan Kamis setiap minggunya.",
      "hukum": "Sunnah",
      "dalil": "...",
      "type": "mingguan"
    },
    {
      "id": 8,
      "nama": "Puasa Ramadhan",
      "deskripsi": "Puasa wajib yang dilaksanakan selama satu bulan penuh di bulan Ramadhan.",
      "hukum": "Wajib (Fardhu 'Ain)",
      "dalil": "...",
      "type": "tahunan",
      "jadwal_hijri": "Ramadhan (sebulan penuh)"
    }
  ]
}`}
          />
          <ApiEndpoint
            title="70 Masalah Terkait Puasa (Fiqh & Adab)"
            method="GET"
            path="/puasa/fiqh"
            category="puasa"
            endpointId="puasa-fiqh"
            responseJson={`{
  "status": true,
  "message": "Berhasil mengambil 70 Masalah Terkait Puasa (Fiqh & Adab).",
  "data": [
    {
      "category": "Definisi & Keutamaan",
      "points": [
        {
          "id": 1,
          "title": "Pengertian Puasa",
          "content": "..."
        }
      ]
    }
  ]
}`}
          />
          <ApiEndpoint
            title="Cari Puasa"
            method="GET"
            path="/puasa/find?query=ramadhan"
            category="puasa"
            endpointId="puasa-find"
            responseJson={`{
  "status": true,
  "message": "Berhasil mencari puasa dengan kata kunci: ramadhan",
  "data": [
    {
      "id": 8,
      "nama": "Puasa Ramadhan",
      "deskripsi": "...",
      "hukum": "Wajib",
      "type": "tahunan"
    }
  ]
}`}
          />
          <ApiEndpoint
            title="Filter by Tipe"
            method="GET"
            path="/puasa/type/mingguan"
            category="puasa"
            endpointId="puasa-type"
            responseJson={`{
  "status": true,
  "message": "Berhasil mendapatkan daftar puasa sunnah untuk tipe: mingguan",
  "data": [
    {
      "id": 1,
      "nama": "Puasa Senin Kamis",
      ...
    }
  ]
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
      "sumber": "Hadits Arbain No. 1: Amalan Bergantung pada Niat"
    }
  }
}`}
          />
          <ApiEndpoint
            title="Kalkulator Waris (Faraidh)"
            method="GET"
            path="/tools/faraidh?totalHarta=120000000&suami=1&anakLk=1&anakPr=1"
            category="tools"
            endpointId="tools-faraidh"
            responseJson={`{
  "status": true,
  "message": "Kalkulasi waris berhasil.",
  "data": {
    "total_harta": 120000000,
    "rincian": [
      { "ahli_waris": "Suami", "jumlah": 1, "bagian_persen": "25.00%", "nominal": 30000000 },
      { "ahli_waris": "Anak Laki-laki", "jumlah": 1, "bagian_persen": "50.00%", "nominal": 60000000 },
      { "ahli_waris": "Anak Perempuan", "jumlah": 1, "bagian_persen": "25.00%", "nominal": 30000000 }
    ],
    "zakat_harta": 3000000,
    "keterangan": "Perhitungan ini menggunakan standar ilmu Faraidh (KHI)...",
    "sumber": "Kompilasi Hukum Islam (KHI) & Fiqh Mawaris"
  }
}`}
          />
          <ApiEndpoint
            title="Kalkulator Zakat"
            method="GET"
            path="/tools/zakat?type=penghasilan&amount=10000000"
            category="tools"
            endpointId="tools-zakat"
            responseJson={`{
  "status": true,
  "message": "Kalkulasi zakat berhasil.",
  "data": {
    "type": "penghasilan",
    "amount": 10000000,
    "nishab": 8500000,
    "isWajib": true,
    "zakat": 250000,
    "keterangan": "Nishab Zakat Penghasilan setara 85 gram emas...",
    "sumber": "BAZNAS (Badan Amil Zakat Nasional)"
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
            title="Pencarian Semantik (Cross-Source)"
            method="GET"
            path="/tools/semantic-search?query=puasa"
            category="tools"
            endpointId="tools-semantic-search"
            responseJson={`{
  "status": true,
  "message": "Pencarian semantik untuk 'puasa' berhasil.",
  "data": {
    "query": "puasa",
    "quran": [
      {
        "arab": "...",
        "text": "Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa...",
        "sumber": "QS. Al-Baqarah: 183"
      }
    ],
    "hadits": [
      {
        "arab": "...",
        "text": "Puasa adalah perisai...",
        "sumber": "HR. Bukhari No. 1894"
      }
    ],
    "puasa": [
      {
        "text": "Puasa Ramadhan: Puasa wajib yang dilaksanakan selama satu bulan penuh...",
        "dalil": "QS. Al-Baqarah: 183",
        "sumber": "Fitur Puasa (Wajib (Fardhu 'Ain))"
      }
    ],
    "fiqh": [
      {
        "text": "Keutamaan Puasa",
        "content": "Puasa memiliki banyak keutamaan, di antaranya adalah sebagai penghapus dosa...",
        "sumber": "70 Masalah Puasa - Sumber: islamqa.info"
      }
    ]
  }
}`}
          />

          <SectionTitle
            id="widgets"
            title="Widget Dashboard"
            icon="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            color="blue"
          />
          <div class="p-6 mb-12 bg-white rounded-2xl border shadow-sm border-slate-200">
            <div class="flex flex-col gap-6 md:flex-row">
              <div class="flex-1">
                <h3 class="mb-4 text-lg font-bold text-slate-800">
                  Cara Menggunakan Widget
                </h3>
                <p class="mb-4 text-sm leading-relaxed text-slate-600">
                  Anda dapat menyematkan widget Muslim API ke dalam website Anda
                  sendiri dengan mudah. Cukup salin kode di samping dan
                  tempelkan di bagian manapun di website Anda.
                </p>
                <div class="space-y-3">
                  <div class="flex gap-3 items-start">
                    <div class="flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]">
                      1
                    </div>
                    <p class="text-xs text-slate-500">
                      Pilih widget yang sesuai dengan kebutuhan Anda.
                    </p>
                  </div>
                  <div class="flex gap-3 items-start">
                    <div class="flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]">
                      2
                    </div>
                    <p class="text-xs text-slate-500">
                      Sesuaikan parameter (kota, tema, dll) jika diperlukan.
                    </p>
                  </div>
                  <div class="flex gap-3 items-start">
                    <div class="flex justify-center items-center mt-1 w-5 h-5 font-bold text-white bg-blue-500 rounded-full text-[10px]">
                      3
                    </div>
                    <p class="text-xs text-slate-500">
                      Copy-paste kode IFrame ke dalam HTML website Anda.
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex-1">
                <div class="p-4 rounded-xl bg-slate-900">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Embed Code
                    </span>
                    <button class="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                      Copy Code
                    </button>
                  </div>
                  <pre class="overflow-x-auto text-[11px] text-blue-300 font-mono">
                    {`<iframe 
  src="https://muslim-api.vercel.app/widget/jadwal-sholat?kota=jakarta" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <SectionTitle
            id="resources"
            title="Other Resources"
            icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            color="emerald"
          />
          <div class="grid grid-cols-1 gap-4 mb-12 md:grid-cols-2">
            {[
              {
                name: "GitHub Repository",
                url: "https://github.com/vrush2000/muslim-all-in-one-api",
                desc: "Source code and documentation",
              },
              {
                name: "Quran Kemenag",
                url: "https://quran.kemenag.go.id/",
                desc: "Official Quran data from Kemenag RI",
              },
              {
                name: "MyQuran (Prayer Times)",
                url: "https://api.myquran.com/",
                desc: "Prayer times and Islamic schedule API",
              },
              {
                name: "equran.id (Audio)",
                url: "https://equran.id/",
                desc: "Quran audio and digital text",
              },
              {
                name: "Muslim API Dataset (Repo)",
                url: "https://github.com/Otangid/muslim-api",
                desc: "Alternative Muslim API provider",
              },
              {
                name: "Hadith Collection (Repo)",
                url: "https://github.com/gadingnst/hadith-api",
                desc: "Comprehensive Hadith collection API",
              },
              {
                name: "Data Pesantren (Repo)",
                url: "https://github.com/nasrul21/data-pesantren-indonesia",
                desc: "Kumpulan data pesantren se-Indonesia (Source)",
              },
              {
                name: "Libur Nasional (Repo)",
                url: "https://github.com/kresnasatya/api-harilibur",
                desc: "Data hari libur nasional Indonesia (Source)",
              },
              {
                name: "Puasa Sunnah (Source)",
                url: "https://github.com/granitebps/puasa-sunnah-api",
                desc: "Referensi data puasa sunnah",
              },
            ].map((resource) => (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                class="p-4 bg-white rounded-xl border transition-all border-slate-200 hover:border-emerald-500 hover:shadow-md group"
              >
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold transition-colors text-slate-900 group-hover:text-emerald-600">
                    {resource.name}
                  </h4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-slate-400 group-hover:text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
                <p class="text-xs leading-relaxed text-slate-500">
                  {resource.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
