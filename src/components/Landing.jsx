/** @jsx jsx */
import { jsx } from 'hono/jsx'

export const Landing = ({ sejarah }) => {
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
      title: 'Sejarah Islam',
      description: 'Akses data sejarah Islam dan Sirah Nabawiyah yang autentik dan terpercaya.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'blue',
      link: '/other#sejarah'
    },
    {
      title: 'Fitur Cerdas & Tools',
      description: 'Kalkulator zakat, pencarian semantik AI, arah kiblat, dan kutipan harian otomatis.',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4.343 4.343l.707.707m1.286 1.286L4.343 4.343M12 21v-1m0-1c-2.761 0-5-2.239-5-5a5 5 0 015-5 5 5 0 015 5c0 2.761-2.239 5-5 5z',
      color: 'emerald',
      link: '/playground?category=tools'
    }
  ];

  return (
    <div class="overflow-hidden relative">
      {/* Hero Section */}
      <section class="relative pt-20 pb-24 bg-white md:pt-32 md:pb-40">
        <div class="relative z-20 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <div class="inline-flex relative z-30 gap-2 items-center px-4 py-2 mb-8 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-full duration-700 animate-in fade-in slide-in-from-bottom-4">
            <span class="flex w-2 h-2">
              <span class="inline-flex relative w-2 h-2 bg-emerald-500 rounded-full"></span>
            </span>
            Platform Data Islami Terlengkap
          </div>
          <h1 class="mb-8 text-4xl font-extrabold tracking-tight duration-1000 sm:text-5xl md:text-7xl text-slate-900 animate-in fade-in slide-in-from-bottom-6">
            Muslim API <span class="block text-emerald-600 md:inline-block">
              <span id="dynamic-text">All-in-One</span><span class="animate-pulse">|</span>
            </span>
          </h1>

          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              const phrases = [
                'All-in-One',
                'Data Al-Qur\\'an',
                'Pencarian AI',
                'Kalkulator Zakat',
                'Arah Kiblat',
                'Hadits Arba\\'in',
                'Tafsir Kemenag',
                'Jadwal Sholat',
                'Koleksi Doa',
                'Sejarah Islam'
              ];
              let i = 0;
              let j = 0;
              let currentPhrase = [];
              let isDeleting = false;
              let isEnd = false;
              
              function loop() {
                const el = document.getElementById('dynamic-text');
                if (!el) {
                  setTimeout(loop, 500);
                  return;
                }

                isEnd = false;
                
                if (i < phrases.length) {
                  if (!isDeleting && j <= phrases[i].length) {
                    currentPhrase.push(phrases[i][j]);
                    j++;
                    el.innerHTML = currentPhrase.join('');
                  }

                  if (isDeleting && j >= 0) {
                    currentPhrase.pop();
                    j--;
                    el.innerHTML = currentPhrase.join('');
                  }

                  if (j == phrases[i].length) {
                    isEnd = true;
                    isDeleting = true;
                  }

                  if (isDeleting && j <= 0) {
                    currentPhrase = [];
                    isDeleting = false;
                    i++;
                    if (i == phrases.length) i = 0;
                    j = 0;
                  }
                }
                const spedUp = Math.random() * (50 - 30) + 30;
                const normalSpeed = Math.random() * (150 - 100) + 100;
                const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
                setTimeout(loop, time);
              }

              // Start the loop after a short delay to ensure DOM is ready
              setTimeout(loop, 100);
            })();
          ` }} />
          <p class="mx-auto mb-12 max-w-3xl text-xl leading-relaxed duration-1000 delay-200 md:text-2xl text-slate-600 animate-in fade-in slide-in-from-bottom-8">
            Infrastruktur data keislaman digital yang cepat, gratis, dan andal. Dirancang untuk mempercepat inovasi dalam dakwah teknologi.
          </p>
          <div class="flex flex-col gap-4 justify-center items-center duration-1000 delay-300 sm:flex-row animate-in fade-in slide-in-from-bottom-10">
            <a 
              href="/docs" 
              class="flex gap-2 justify-center items-center px-8 py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all sm:w-auto hover:bg-emerald-700 shadow-emerald-200 hover:shadow-emerald-300"
            >
              Mulai Dokumentasi
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7" />
              </svg>
            </a>
            <a 
              href="https://github.com/vrush2000/muslim-all-in-one-api" 
              target="_blank"
              class="flex gap-2 justify-center items-center px-8 py-4 w-full text-lg font-bold rounded-2xl transition-all sm:w-auto bg-slate-100 text-slate-900 hover:bg-slate-200"
            >
              GitHub Project
            </a>
          </div>
        </div>

        {/* Decorative background elements */}
        <div class="overflow-hidden absolute inset-0 z-0 pointer-events-none">
          <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
        </div>
      </section>

      {/* About & Background Section */}
      <section class="py-24 bg-slate-50 border-y border-slate-200">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
            <div class="space-y-8">
              <div class="inline-block px-4 py-1.5 text-sm font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-lg">
                Visi & Latar Belakang
              </div>
              <h2 class="text-3xl font-bold md:text-4xl text-slate-900">Mengapa Muslim API?</h2>
              <div class="space-y-6 text-lg leading-relaxed text-slate-600">
                <p>
                  Di era digital saat ini, akses terhadap data keislaman yang akurat, cepat, dan mudah diintegrasikan adalah sebuah kebutuhan fundamental. Banyak pengembang menghadapi kesulitan dalam menemukan API yang menyediakan data lengkap tanpa batasan yang memberatkan.
                </p>
                
                <div class="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
                  <div class="space-y-3">
                    <h4 class="flex gap-2 items-center text-xl font-bold text-slate-900">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Misi Kami
                    </h4>
                    <p class="text-base">
                      Menjadi <span class="font-semibold text-emerald-600">"Single Source of Truth"</span> untuk data keislaman digital di Indonesia. Kami menyediakan infrastruktur data yang andal bagi siapapun yang ingin berdakwah melalui teknologi.
                    </p>
                  </div>
                  <div class="space-y-3">
                    <h4 class="flex gap-2 items-center text-xl font-bold text-slate-900">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Filosofi Terbuka
                    </h4>
                    <p class="text-base">
                      Muslim API dibangun dengan semangat <span class="font-semibold text-emerald-600">Open Source</span>. Kami percaya bahwa ilmu agama harus dapat diakses seluas-luasnya tanpa ada penghalang teknis atau biaya.
                    </p>
                  </div>
                </div>

                <div class="pt-8 mt-8 italic text-center border-t border-slate-200 text-slate-500 md:text-left">
                  "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="relative z-10 p-8 bg-white rounded-3xl border shadow-2xl border-slate-200">
                <div class="space-y-6">
                  <div class="flex gap-4 items-start">
                    <div class="flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="mb-1 font-bold text-slate-900">Data Terverifikasi</h4>
                      <p class="text-sm text-slate-500">Sumber data Al-Quran kami mengikuti standar Mushaf Al-Quran Standar Indonesia (MSI) Kemenag RI.</p>
                    </div>
                  </div>
                  <div class="flex gap-4 items-start">
                    <div class="flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="mb-1 font-bold text-slate-900">High Availability</h4>
                      <p class="text-sm text-slate-500">Dibangun di atas infrastruktur serverless untuk memastikan API selalu tersedia kapanpun dibutuhkan.</p>
                    </div>
                  </div>
                  <div class="flex gap-4 items-start">
                    <div class="flex justify-center items-center w-10 h-10 bg-emerald-100 rounded-xl shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="mb-1 font-bold text-slate-900">Data Integrity Chain</h4>
                      <p class="text-sm text-slate-500">Keaslian data dijamin melalui cryptographic hashing untuk menjaga kemurnian teks suci secara transparan.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute -right-6 -bottom-6 w-full h-full rounded-3xl bg-emerald-600/5 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Menu Section */}
      <section class="py-24 bg-white">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="mb-16 text-center">
            <h2 class="mb-4 text-3xl font-bold md:text-4xl text-slate-900">Layanan API Kami</h2>
            <p class="mx-auto max-w-2xl text-lg text-slate-600">
              Berbagai kategori API yang siap Anda integrasikan ke dalam aplikasi Anda secara instan.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {apiCategories.map((api, index) => (
              <a 
                key={index}
                href={api.link}
                class="overflow-hidden relative p-8 bg-white rounded-3xl border transition-all duration-300 group border-slate-200 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-100"
              >
                <div class={`absolute top-0 right-0 w-24 h-24 bg-${api.color}-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div class={`w-14 h-14 bg-${api.color}-100 rounded-2xl flex items-center justify-center text-${api.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={api.icon} />
                  </svg>
                </div>

                <h3 class="relative z-10 mb-3 text-xl font-bold text-slate-900">{api.title}</h3>
                <p class="relative z-10 mb-6 leading-relaxed text-slate-600">{api.description}</p>
                
                <div class={`flex items-center gap-2 text-${api.color}-600 font-bold relative z-10`}>
                  Lihat Dokumentasi
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Timeline Sejarah Islam Section */}
          <div class="mt-32 mb-20">
            <div class="mb-16 text-center">
              <div class="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-lg">
                Timeline Peradaban
              </div>
              <h2 class="mb-6 text-3xl font-bold md:text-5xl text-slate-900">Sejarah & Sirah Nabawiyah</h2>
              <p class="mx-auto max-w-2xl text-lg text-slate-600">
                Telusuri jejak sejarah Islam melalui timeline interaktif yang bersumber dari Sirah Nabawiyah yang autentik.
              </p>
            </div>

            <div class="relative">
              {/* Vertical Line for Timeline */}
              <div class="hidden absolute left-1/2 w-0.5 h-full transform -translate-x-1/2 bg-slate-200 md:block"></div>

              <div class="relative space-y-12">
                {sejarah && sejarah.slice(0, 8).map((item, index) => (
                  <div key={item.id} class={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Content */}
                    <div class="w-full md:w-1/2">
                      <div class={`p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                        <div class={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${index % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.tahun}
                        </div>
                        <h3 class="mb-3 text-2xl font-bold text-slate-900">{item.peristiwa}</h3>
                        <p class="mb-4 leading-relaxed text-slate-600">{item.deskripsi}</p>
                        <div class="text-xs italic font-medium text-slate-400">Sumber: {item.sumber}</div>
                        
                        {/* Dot on line for MD screens */}
                        <div class={`absolute top-1/2 w-4 h-4 bg-white border-4 border-emerald-500 rounded-full z-10 hidden md:block ${index % 2 === 0 ? '-right-10' : '-left-10'} transform -translate-y-1/2`}></div>
                      </div>
                    </div>

                    {/* Image or Placeholder */}
                    <div class="w-full md:w-1/2">
                      <div class="relative group overflow-hidden rounded-3xl aspect-[16/9] shadow-lg">
                        <img 
                          src={item.image_url || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800'} 
                          alt={item.peristiwa}
                          class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t to-transparent opacity-60 from-slate-900/60"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div class="mt-12 text-center">
                <a href="/other#sejarah" class="inline-flex gap-2 items-center px-8 py-4 font-bold text-white bg-blue-600 rounded-2xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
                  Lihat Seluruh Timeline
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* New Widget Section */}
            <div class="mt-40 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden">
              <div class="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 rounded-full blur-3xl bg-emerald-500/10"></div>
              <div class="absolute bottom-0 left-0 -mb-32 -ml-32 w-64 h-64 rounded-full blur-3xl bg-blue-500/10"></div>
              
              <div class="grid relative z-10 grid-cols-1 gap-16 items-center lg:grid-cols-2">
                <div>
                  <div class="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-emerald-400 uppercase rounded-lg bg-emerald-500/10">
                    Integrasi Mudah
                  </div>
                  <h2 class="mb-6 text-4xl font-bold text-white md:text-5xl">Pasang Widget Islami di Website Anda</h2>
                  <p class="mb-10 text-xl leading-relaxed text-slate-400">
                    Tingkatkan engagement pengunjung website Anda dengan memasang widget Jadwal Sholat dan Ayat Harian yang elegan, ringan, dan responsif. Cukup copy-paste kode embed.
                  </p>
                  
                  <ul class="mb-10 space-y-4">
                    {[
                      'Desain Modern & Minimalis',
                      'Ringan & Cepat (Tanpa library berat)',
                      'Otomatis Update Setiap Hari',
                      'Responsif di Semua Ukuran Layar'
                    ].map((feat, i) => (
                      <li key={i} class="flex gap-3 items-center text-slate-300">
                        <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <a href="/docs" class="inline-flex gap-2 items-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-2xl transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/40">
                    Dapatkan Kode Embed
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </a>
                </div>
                
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Preview Card 1 */}
                  <div class="p-6 rounded-3xl border backdrop-blur-sm bg-white/5 border-white/10">
                    <div class="w-full aspect-[3/4] bg-emerald-600/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                       <div class="p-4 w-full h-full">
                          <div class="mb-4 w-full h-8 bg-emerald-600 rounded-lg"></div>
                          <div class="space-y-3">
                            {[1,2,3,4,5].map(i => <div key={i} class="flex justify-between items-center px-2 w-full h-6 rounded-md bg-white/10"><div class="w-12 h-2 rounded bg-white/20"></div><div class="w-8 h-2 rounded bg-white/30"></div></div>)}
                          </div>
                       </div>
                    </div>
                    <h4 class="font-bold text-center text-white">Widget Sholat</h4>
                  </div>
                  {/* Preview Card 2 */}
                  <div class="p-6 rounded-3xl border backdrop-blur-sm bg-white/5 border-white/10">
                    <div class="w-full aspect-[3/4] bg-blue-600/20 rounded-2xl mb-4 flex items-center justify-center">
                      <div class="flex flex-col justify-center p-6 w-full h-full text-center">
                          <div class="mb-8 w-full h-4 bg-blue-600 rounded-lg"></div>
                          <div class="mx-auto mb-3 w-3/4 h-2 rounded bg-white/20"></div>
                          <div class="mx-auto w-1/2 h-2 rounded bg-white/10"></div>
                      </div>
                    </div>
                    <h4 class="font-bold text-center text-white">Widget Ayat</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playground CTA */}
          <div class="mt-20 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path fill="#10B981" d="M47.7,-63.9C61.1,-55.8,70.8,-41,75.9,-25.1C81,-9.1,81.6,7.9,76.5,23.1C71.4,38.3,60.6,51.6,47.2,60.4C33.8,69.1,17.9,73.3,1.4,71.4C-15.1,69.4,-30.2,61.4,-44.2,52.5C-58.1,43.7,-70.9,34.1,-76.3,21.1C-81.8,8,-79.9,-8.5,-73.3,-22.9C-66.7,-37.3,-55.4,-49.6,-42.4,-57.8C-29.4,-66,-14.7,-70.1,0.6,-71C15.9,-71.8,31.8,-69.5,47.7,-63.9Z" transform="translate(200 200)" />
              </svg>
            </div>
            <div class="grid relative z-10 grid-cols-1 gap-12 items-center lg:grid-cols-2">
              <div>
                <h2 class="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl">
                  Coba API secara langsung di <span class="text-emerald-400">Playground</span>
                </h2>
                <p class="mb-10 text-xl leading-relaxed text-slate-400">
                  Tidak perlu setup environment. Cukup pilih endpoint, masukkan parameter, dan lihat hasilnya dalam sekejap. Rasakan kemudahan integrasi Muslim API sekarang juga.
                </p>
                <a 
                  href="/playground" 
                  class="inline-flex gap-3 items-center px-8 py-4 text-lg font-bold text-white bg-emerald-500 rounded-2xl shadow-xl transition-all hover:bg-emerald-400 shadow-emerald-500/20"
                >
                  Buka Playground
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </a>
              </div>
              <div class="hidden lg:block">
                <div class="p-6 rounded-3xl border shadow-2xl backdrop-blur-xl bg-slate-800/50 border-slate-700">
                  <div class="flex gap-2 items-center mb-4">
                    <div class="flex gap-1.5">
                      <div class="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  <pre class="p-0 font-mono text-sm leading-relaxed text-emerald-400 bg-transparent">
{`{
  "status": true,
  "message": "Berhasil mengambil data surah.",
  "data": {
    "surah": "Al-Fatihah",
    "ayat": 7,
    "revelation": "Makkiyah",
    "translation": "Pembukaan"
  }
} `}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="overflow-hidden relative py-24 bg-slate-900">
        <div class="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <h2 class="mb-8 text-3xl font-bold text-white md:text-5xl">Siap Membangun Masa Depan Dakwah Digital?</h2>
          <p class="mx-auto mb-12 max-w-2xl text-xl text-slate-400">
            Bergabunglah dengan ribuan pengembang lainnya yang telah menggunakan Muslim API. Mulai secara gratis hari ini.
          </p>
          <div class="flex flex-col gap-4 justify-center items-center sm:flex-row">
            <a 
              href="/docs" 
              class="flex gap-2 justify-center items-center px-10 py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all sm:w-auto hover:bg-emerald-500 shadow-emerald-900/20"
            >
              Dapatkan Akses API
            </a>
            <a 
              href="/other" 
              class="flex gap-2 justify-center items-center px-10 py-4 w-full text-lg font-bold text-white rounded-2xl border backdrop-blur-sm transition-all sm:w-auto bg-white/10 border-white/20 hover:bg-white/20"
            >
              Lihat Contoh
            </a>
          </div>
        </div>
        
        {/* Abstract background for dark CTA */}
        <div class="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]"></div>
          <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[150px]"></div>
        </div>
      </section>
    </div>
  )
}
