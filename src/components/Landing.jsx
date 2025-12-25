/** @jsx jsx */
import { jsx } from 'hono/jsx'

export const Landing = () => {
  const apiCategories = [
    {
      title: 'Al-Quran Indonesia',
      description: 'Akses 114 Surah lengkap dengan teks Arab, Latin, Terjemahan, dan Tafsir Kemenag (Wajiz & Tahlili).',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'emerald',
      link: '/docs#quran'
    },
    {
      title: 'Jadwal Sholat',
      description: 'Jadwal waktu sholat harian berdasarkan kota atau koordinat lokasi di seluruh Indonesia.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'blue',
      link: '/other#sholat'
    },
    {
      title: 'Hadits Arba\'in',
      description: 'Kumpulan Hadits Arba\'in Nawawi lengkap dengan teks Arab, terjemahan Indonesia, dan penjelasan.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'amber',
      link: '/other#hadits'
    },
    {
      title: 'Doa Harian',
      description: 'Kumpulan doa-doa harian, dzikir pagi petang, dan doa setelah sholat.',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'rose',
      link: '/other#doa'
    },
    {
      title: 'Murottal Audio',
      description: 'Streaming audio murottal dari berbagai Qari ternama dunia dengan kualitas tinggi.',
      icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
      color: 'purple',
      link: '/other#murottal'
    },
    {
      title: 'Asmaul Husna',
      description: 'Daftar 99 nama Allah yang indah beserta arti, makna, dan dalilnya.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z',
      color: 'indigo',
      link: '/other#asma'
    },
    {
      title: 'Kemenag Open Data',
      description: 'Akses data publik Kemenag seperti daftar pesantren, masjid, dan hari libur nasional.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'teal',
      link: '/other#kemenag'
    },
    {
      title: 'Sejarah & Fatwa',
      description: 'Kumpulan sejarah Islam Nusantara dan tanya jawab (fatwa) dari berbagai lembaga otoritas.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'blue',
      link: '/other#sejarah'
    }
  ];

  return (
    <div class="relative overflow-hidden">
      {/* Hero Section */}
      <section class="relative pt-20 pb-24 md:pt-32 md:pb-40 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-30">
            <span class="flex h-2 w-2">
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Platform Data Islami Terlengkap
          </div>
          <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Muslim <span class="text-emerald-600 block md:inline">All-in-One API</span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Infrastruktur data keislaman digital yang cepat, gratis, dan andal. Dirancang untuk mempercepat inovasi dalam dakwah teknologi.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <a 
              href="/docs" 
              class="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2"
            >
              Mulai Dokumentasi
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7" />
              </svg>
            </a>
            <a 
              href="https://github.com/vrush2000/muslim-all-in-one-api" 
              target="_blank"
              class="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              GitHub Project
            </a>
          </div>
        </div>

        {/* Decorative background elements */}
        <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
        </div>
      </section>

      {/* About & Background Section */}
      <section class="py-24 bg-slate-50 border-y border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="space-y-8">
              <div class="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold uppercase tracking-wider">
                Visi & Latar Belakang
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Mengapa Muslim API diciptakan?</h2>
              <div class="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Di era digital saat ini, akses terhadap data keislaman yang akurat, cepat, dan mudah diintegrasikan adalah sebuah kebutuhan fundamental. Banyak pengembang menghadapi kesulitan dalam menemukan API yang menyediakan data lengkap tanpa batasan yang memberatkan.
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div class="space-y-3">
                    <h4 class="font-bold text-slate-900 flex items-center gap-2 text-xl">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Misi Kami
                    </h4>
                    <p class="text-base">
                      Menjadi <span class="text-emerald-600 font-semibold">"Single Source of Truth"</span> untuk data keislaman digital di Indonesia. Kami menyediakan infrastruktur data yang andal bagi siapapun yang ingin berdakwah melalui teknologi.
                    </p>
                  </div>
                  <div class="space-y-3">
                    <h4 class="font-bold text-slate-900 flex items-center gap-2 text-xl">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Filosofi Terbuka
                    </h4>
                    <p class="text-base">
                      Muslim API dibangun dengan semangat <span class="text-emerald-600 font-semibold">Open Source</span>. Kami percaya bahwa ilmu agama harus dapat diakses seluas-luasnya tanpa ada penghalang teknis atau biaya.
                    </p>
                  </div>
                </div>

                <div class="mt-8 pt-8 border-t border-slate-200 italic text-slate-500 text-center md:text-left">
                  "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 relative z-10">
                <div class="space-y-6">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 mb-1">Data Terverifikasi</h4>
                      <p class="text-slate-500 text-sm">Sumber data Al-Quran kami mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI) Kemenag RI.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 mb-1">High Availability</h4>
                      <p class="text-slate-500 text-sm">Dibangun di atas infrastruktur serverless untuk memastikan API selalu tersedia kapanpun dibutuhkan.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 mb-1">Blockchain Integrity</h4>
                      <p class="text-slate-500 text-sm">Keaslian data dijamin melalui cryptographic hashing untuk menjaga kemurnian teks suci.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute -bottom-6 -right-6 w-full h-full bg-emerald-600/5 rounded-3xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Menu Section */}
      <section class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Layanan API Kami</h2>
            <p class="text-lg text-slate-600 max-w-2xl mx-auto">
              Berbagai kategori API yang siap Anda integrasikan ke dalam aplikasi Anda secara instan.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apiCategories.map((api, index) => (
              <a 
                key={index}
                href={api.link}
                class="group p-8 rounded-3xl border border-slate-200 bg-white hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300 relative overflow-hidden"
              >
                <div class={`absolute top-0 right-0 w-24 h-24 bg-${api.color}-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div class={`w-14 h-14 bg-${api.color}-100 rounded-2xl flex items-center justify-center text-${api.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={api.icon} />
                  </svg>
                </div>

                <h3 class="text-xl font-bold text-slate-900 mb-3 relative z-10">{api.title}</h3>
                <p class="text-slate-600 leading-relaxed mb-6 relative z-10">{api.description}</p>
                
                <div class={`flex items-center gap-2 text-${api.color}-600 font-bold relative z-10`}>
                  Lihat Dokumentasi
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Playground CTA */}
          <div class="mt-20 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path fill="#10B981" d="M47.7,-63.9C61.1,-55.8,70.8,-41,75.9,-25.1C81,-9.1,81.6,7.9,76.5,23.1C71.4,38.3,60.6,51.6,47.2,60.4C33.8,69.1,17.9,73.3,1.4,71.4C-15.1,69.4,-30.2,61.4,-44.2,52.5C-58.1,43.7,-70.9,34.1,-76.3,21.1C-81.8,8,-79.9,-8.5,-73.3,-22.9C-66.7,-37.3,-55.4,-49.6,-42.4,-57.8C-29.4,-66,-14.7,-70.1,0.6,-71C15.9,-71.8,31.8,-69.5,47.7,-63.9Z" transform="translate(200 200)" />
              </svg>
            </div>
            <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Coba API secara langsung di <span class="text-emerald-400">Playground</span>
                </h2>
                <p class="text-xl text-slate-400 mb-10 leading-relaxed">
                  Tidak perlu setup environment. Cukup pilih endpoint, masukkan parameter, dan lihat hasilnya dalam sekejap. Rasakan kemudahan integrasi Muslim API sekarang juga.
                </p>
                <a 
                  href="/playground" 
                  class="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                >
                  Buka Playground
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </a>
              </div>
              <div class="hidden lg:block">
                <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="flex gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <pre class="bg-transparent p-0 text-emerald-400 text-sm font-mono leading-relaxed">
{`{
  "status": true,
  "message": "Success fetching data",
  "data": {
    "surah": "Al-Fatihah",
    "ayat": 7,
    "revelation": "Makkiyah",
    "translation": "Pembukaan"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-24 bg-slate-900 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-8">Siap Membangun Masa Depan Dakwah Digital?</h2>
          <p class="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengembang lainnya yang telah menggunakan Muslim API. Mulai secara gratis hari ini.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/docs" 
              class="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              Dapatkan Akses API
            </a>
            <a 
              href="/other" 
              class="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Lihat Contoh
            </a>
          </div>
        </div>
        
        {/* Abstract background for dark CTA */}
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]"></div>
          <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]"></div>
        </div>
      </section>
    </div>
  )
}
