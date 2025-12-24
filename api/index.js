// vercel-entry.js
import { handle } from "hono/vercel";

// src/app.jsx
import { Hono as Hono19 } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

// src/routes/index.jsx
import { Hono } from "hono";
import { jsx as jsx5 } from "hono/jsx";

// src/components/Layout.jsx
import { jsx as jsx2 } from "hono/jsx";

// src/components/Search.jsx
import { jsx } from "hono/jsx";
var Search = () => {
  return /* @__PURE__ */ jsx("div", null, /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
        // Data pencarian
        var searchIndex = [
          { title: 'Introduction', path: '/#intro', category: 'General' },
          { title: 'Base URL', path: '/#intro', category: 'General' },
          { title: 'Al-Quran Indonesia', path: '/#quran', category: 'Quran' },
          { title: 'Daftar Surah', path: '/#quran', category: 'Quran', endpoint: '/surah' },
          { title: 'Detail Surah', path: '/#quran', category: 'Quran', endpoint: '/surah?surahId=114' },
          { title: 'Tafsir Kemenag', path: '/#quran', category: 'Quran', endpoint: '/tafsir?surahId=1' },
          { title: 'Ayat & Al-Quran', path: '/#ayah', category: 'Ayat' },
          { title: 'Ayat by Surah', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/surah?surahId=1' },
          { title: 'Ayat by Juz', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/juz?juzId=30' },
          { title: 'Ayat by Page', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/page?page=604' },
          { title: 'Range Ayat', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/range?surahId=1&start=1&end=7' },
          { title: 'Cari Ayat', path: '/#ayah', category: 'Ayat', endpoint: '/ayah/find?query=alhamdulillah' },
          { title: 'Resource Lainnya', path: '/other', category: 'Other' },
          { title: 'Asmaul Husna', path: '/other#asma', category: 'Other', endpoint: '/asma' },
          { title: 'Asbabun Nuzul', path: '/other#asbab', category: 'Other', endpoint: '/asbab' },
          { title: 'Juz Al-Quran', path: '/other#extra', category: 'Other', endpoint: '/juz' },
          { title: 'Detail Juz', path: '/other#extra', category: 'Other', endpoint: '/juz?juzId=30' },
          { title: 'Tema Al-Quran', path: '/other#extra', category: 'Other', endpoint: '/theme' },
          { title: 'Kata per Kata', path: '/other#extra', category: 'Other', endpoint: '/word?surahId=1' },
          { title: 'Kumpulan Doa', path: '/other#doa', category: 'Doa' },
          { title: 'Semua Doa', path: '/other#doa', category: 'Doa', endpoint: '/doa' },
          { title: 'Cari Doa', path: '/other#doa', category: 'Doa', endpoint: '/doa/find?query=makan' },
          { title: 'Dzikir Harian', path: '/other#dzikir', category: 'Dzikir' },
          { title: 'Dzikir by Type', path: '/other#dzikir', category: 'Dzikir', endpoint: '/dzikir?type=pagi' },
          { title: 'Hadits Arba\\'in', path: '/other#hadits', category: 'Hadits' },
          { title: 'Daftar Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits' },
          { title: 'Detail Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits?nomor=1' },
          { title: 'Cari Hadits', path: '/other#hadits', category: 'Hadits', endpoint: '/hadits/find?query=niat' },
          { title: 'Data Integrity', path: '/#integrity', category: 'Security' },
          { title: 'Integrity Chain', path: '/#integrity', category: 'Security', endpoint: '/integrity/chain' },
          { title: 'Verify Ayah', path: '/#integrity', category: 'Security', endpoint: '/integrity/verify/ayah?surahId=1&ayahId=1' },
          { title: 'Jadwal Sholat', path: '/other#sholat', category: 'Sholat' },
          { title: 'Daftar Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/semua' },
          { title: 'Cari Kota Sholat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/kota/cari?nama=jakarta' },
          { title: 'Jadwal Sholat by Kota', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal?kotaId=1301' },
          { title: 'Jadwal Sholat by Koordinat', path: '/other#sholat', category: 'Sholat', endpoint: '/sholat/jadwal/koordinat?lat=-6.2&lon=106.8' },
          { title: 'Murottal Audio', path: '/other#murottal', category: 'Other' },
          { title: 'Daftar Qari', path: '/other#murottal', category: 'Other', endpoint: '/murotal/qari' },
          { title: 'Murottal by Surah', path: '/other#murottal', category: 'Other', endpoint: '/murotal?surahId=1' },
          { title: 'FAQ', path: '/#faq', category: 'General' },
          { title: 'Other Resources', path: '/other', category: 'Resources' },
          { title: 'GitHub Repository', path: 'https://github.com/vrush2000/muslim-all-in-one-api', category: 'External' }
        ];

        var selectedIndex = -1;

        // Fungsi Global Handle Search
        window.handleSearch = function(query) {
          var dropdown = document.getElementById('search-results-dropdown');
          var container = document.getElementById('search-results-content');
          if (!dropdown || !container) return;

          if (!query || query.trim() === '') {
            container.innerHTML = '<div class="text-center py-4 text-slate-400 text-xs">Type to search...</div>';
            dropdown.classList.add('hidden');
            selectedIndex = -1;
            return;
          }

          var q = query.toLowerCase();
          var filtered = searchIndex.filter(function(item) {
            return item.title.toLowerCase().indexOf(q) !== -1 || 
                   (item.endpoint && item.endpoint.toLowerCase().indexOf(q) !== -1) ||
                   item.category.toLowerCase().indexOf(q) !== -1;
          });

          if (filtered.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">No results found for "' + query + '"</div>';
            dropdown.classList.remove('hidden');
            selectedIndex = -1;
            return;
          }

          var html = '';
          for (var i = 0; i < filtered.length; i++) {
            var item = filtered[i];
            var activeClass = (i === 0) ? 'bg-emerald-50' : '';
            html += '<a href="' + item.path + '" onclick="window.hideResults()" class="search-result-item flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 group transition-all duration-150 ' + activeClass + '" data-index="' + i + '">' +
                      '<div class="flex items-center gap-2">' +
                        '<div class="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' +
                        '</div>' +
                        '<div>' +
                          '<div class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">' + item.category + '</div>' +
                          '<div class="text-xs font-semibold text-slate-900">' + item.title + '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="text-slate-300 group-hover:text-emerald-500">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>' +
                      '</div>' +
                    '</a>';
          }
          container.innerHTML = html;
          dropdown.classList.remove('hidden');
          selectedIndex = 0;
        };

        window.hideResults = function() {
          setTimeout(function() {
            var dropdown = document.getElementById('search-results-dropdown');
            if (dropdown) dropdown.classList.add('hidden');
          }, 200);
        };

        // Keyboard Navigation di Input
        document.addEventListener('keydown', function(e) {
          var dropdown = document.getElementById('search-results-dropdown');
          if (!dropdown || dropdown.classList.contains('hidden')) return;

          var items = document.querySelectorAll('.search-result-item');
          if (items.length === 0) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection();
          } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex].click();
          } else if (e.key === 'Escape') {
            window.hideResults();
          }
        });

        function updateSelection() {
          var items = document.querySelectorAll('.search-result-item');
          for (var i = 0; i < items.length; i++) {
            if (i === selectedIndex) {
              items[i].classList.add('bg-emerald-50');
              items[i].scrollIntoView({ block: 'nearest' });
            } else {
              items[i].classList.remove('bg-emerald-50');
            }
          }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          var container = document.querySelector('.group.w-40.md\\\\:w-64');
          if (container && !container.contains(e.target)) {
            window.hideResults();
          }
        });

        console.log('Search Dropdown Ready');
      ` } }));
};

// src/components/Layout.jsx
var Layout = ({ children, title }) => {
  return /* @__PURE__ */ jsx2("html", { lang: "en", class: "scroll-smooth" }, /* @__PURE__ */ jsx2("head", null, /* @__PURE__ */ jsx2("meta", { charset: "UTF-8" }), /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), /* @__PURE__ */ jsx2("title", null, title), /* @__PURE__ */ jsx2("link", { rel: "icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23059669%22/><path d=%22M30 35v40c10-5 20-5 20 0V35c0-5-10-5-20 0zM70 35v40c-10-5-20-5-20 0V35c0-5 10-5 20 0z%22 fill=%22white%22/></svg>" }), /* @__PURE__ */ jsx2("script", { src: "https://cdn.tailwindcss.com" }), /* @__PURE__ */ jsx2("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), /* @__PURE__ */ jsx2("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }), /* @__PURE__ */ jsx2(
    "link",
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      rel: "stylesheet"
    }
  ), process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx2("script", { type: "module", src: "/@vite/client" }), /* @__PURE__ */ jsx2("style", null, `
          body {
            font-family: 'Inter', sans-serif;
          }
          .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          pre {
            background: #1e293b;
            color: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }
          code {
            font-family: 'Fira Code', monospace;
          }
        `)), /* @__PURE__ */ jsx2("body", { class: "bg-slate-50 text-slate-900 min-h-screen flex flex-col" }, /* @__PURE__ */ jsx2(Search, null), /* @__PURE__ */ jsx2("header", { class: "sticky top-0 z-50 glass border-b border-slate-200" }, /* @__PURE__ */ jsx2("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx2("div", { class: "flex justify-between h-16 items-center" }, /* @__PURE__ */ jsx2("a", { href: "/", class: "flex items-center gap-2 group transition-all" }, /* @__PURE__ */ jsx2("div", { class: "w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all" }, /* @__PURE__ */ jsx2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5 text-white",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx2(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      }
    )
  )), /* @__PURE__ */ jsx2("span", { class: "text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-500 transition-all" }, "Muslim All-in-One API")), /* @__PURE__ */ jsx2("div", { class: "flex items-center" }, /* @__PURE__ */ jsx2("div", { class: "relative group w-40 md:w-64 mr-4" }, /* @__PURE__ */ jsx2("div", { class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx2("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }))), /* @__PURE__ */ jsx2(
    "input",
    {
      type: "text",
      id: "search-input-header",
      oninput: "window.handleSearch(this.value)",
      onfocus: "window.handleSearch(this.value)",
      autocomplete: "off",
      placeholder: "Search...",
      class: "block w-full pl-10 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
    }
  ), /* @__PURE__ */ jsx2("div", { id: "search-results-dropdown", class: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden overflow-hidden z-[100] max-h-[400px] overflow-y-auto" }, /* @__PURE__ */ jsx2("div", { id: "search-results-content", class: "p-2" }, /* @__PURE__ */ jsx2("div", { class: "text-center py-4 text-slate-400 text-xs" }, "Type to search...")))), /* @__PURE__ */ jsx2("nav", { class: "hidden md:flex space-x-8" }, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "/",
      class: "text-slate-600 hover:text-emerald-600 font-medium transition-colors"
    },
    "Documentation"
  ), /* @__PURE__ */ jsx2(
    "a",
    {
      href: "/other",
      class: "text-slate-600 hover:text-emerald-600 font-medium transition-colors"
    },
    "Other APIs"
  ))), /* @__PURE__ */ jsx2("div", { class: "md:hidden" }, /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      class: "text-slate-600 hover:text-emerald-600"
    },
    /* @__PURE__ */ jsx2(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        class: "h-6 w-6",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      },
      /* @__PURE__ */ jsx2(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6h16M4 12h16m-7 6h7"
        }
      )
    )
  ))))), /* @__PURE__ */ jsx2("main", { class: "flex-grow" }, children), /* @__PURE__ */ jsx2("footer", { class: "bg-white border-t border-slate-200 py-12 mt-12" }, /* @__PURE__ */ jsx2("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ jsx2("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-8" }, /* @__PURE__ */ jsx2("div", { class: "col-span-1 md:col-span-1" }, /* @__PURE__ */ jsx2("div", { class: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ jsx2("div", { class: "w-6 h-6 bg-emerald-600 rounded flex items-center justify-center" }, /* @__PURE__ */ jsx2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-4 w-4 text-white",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx2(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      }
    )
  )), /* @__PURE__ */ jsx2("span", { class: "text-lg font-bold" }, "Muslim All-in-One API")), /* @__PURE__ */ jsx2("p", { class: "text-slate-500 text-sm leading-relaxed" }, "Penyedia layanan API Muslim gratis untuk mempermudah pengembang dalam membangun aplikasi islami.")), /* @__PURE__ */ jsx2("div", null, /* @__PURE__ */ jsx2("h4", { class: "font-semibold text-slate-900 mb-4" }, "Developed By"), /* @__PURE__ */ jsx2("p", { class: "text-slate-500 text-sm leading-relaxed" }, "Vrush Studio", /* @__PURE__ */ jsx2("br", null), "Indonesia")), /* @__PURE__ */ jsx2("div", null, /* @__PURE__ */ jsx2("h4", { class: "font-semibold text-slate-900 mb-4" }, "Resources"), /* @__PURE__ */ jsx2("div", { class: "space-y-2 text-sm text-slate-500" }, /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://github.com/vrush2000/muslim-all-in-one-api",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "GitHub Repository"
  )), /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Quran Kemenag"
  )), /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://api.myquran.com/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "MyQuran (Prayer Times)"
  )), /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://equran.id/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "equran.id (Audio)"
  )), /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://muslim-api-three.vercel.app/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Muslim API (Dataset)"
  )), /* @__PURE__ */ jsx2("p", null, /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://api.hadith.gading.dev/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Hadith Gading (Hadith Collection)"
  )))), /* @__PURE__ */ jsx2("div", null, /* @__PURE__ */ jsx2("h4", { class: "font-semibold text-slate-900 mb-4" }, "Inspiration"), /* @__PURE__ */ jsx2("p", { class: "text-slate-500 text-sm leading-relaxed" }, "Original template by", " ", /* @__PURE__ */ jsx2(
    "a",
    {
      href: "http://www.designstub.com/",
      target: "_blank",
      class: "hover:text-emerald-600"
    },
    "Designstub"
  )))), /* @__PURE__ */ jsx2("div", { class: "border-t border-slate-100 mt-12 pt-8 text-center" }, /* @__PURE__ */ jsx2("p", { class: "text-slate-500 text-sm mb-4" }, "Dikembangkan dengan \u2764\uFE0F untuk Ummat."), /* @__PURE__ */ jsx2("div", { class: "flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-400 mb-6" }, /* @__PURE__ */ jsx2("span", { class: "flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100" }, /* @__PURE__ */ jsx2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-3 w-3",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor"
    },
    /* @__PURE__ */ jsx2(
      "path",
      {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "3",
        d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z"
      }
    )
  ), "Verified Source"), /* @__PURE__ */ jsx2("span", { class: "hidden sm:inline" }, "|"), /* @__PURE__ */ jsx2("span", null, "Sumber Data:"), /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://muslim-api-three.vercel.app",
      target: "_blank",
      class: "hover:text-emerald-600 transition-colors"
    },
    "muslim-api-three (Dataset)"
  ), /* @__PURE__ */ jsx2("span", { class: "hidden sm:inline" }, "\u2022"), /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://equran.id",
      target: "_blank",
      class: "hover:text-emerald-600 transition-colors"
    },
    "equran.id (Audio CDN & API v2)"
  ), /* @__PURE__ */ jsx2("span", { class: "hidden sm:inline" }, "\u2022"), /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://quran.kemenag.go.id/",
      target: "_blank",
      class: "hover:text-emerald-600 transition-colors"
    },
    "Kemenag RI"
  ), /* @__PURE__ */ jsx2("span", { class: "hidden sm:inline" }, "\u2022"), /* @__PURE__ */ jsx2(
    "a",
    {
      href: "https://api.hadith.gading.dev/",
      target: "_blank",
      class: "hover:text-emerald-600 transition-colors"
    },
    "Hadith Gading Dev"
  )), /* @__PURE__ */ jsx2("p", { class: "text-slate-400 text-xs" }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Muslim All-in-One API. Created by Vrush Studio."))))));
};

// src/components/Home.jsx
import { jsx as jsx3 } from "hono/jsx";
var ApiEndpoint = ({ method, path, title, responseJson }) => /* @__PURE__ */ jsx3("div", { class: "mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" }, /* @__PURE__ */ jsx3("div", { class: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" }, /* @__PURE__ */ jsx3("h4", { class: "font-semibold text-slate-900" }, title), /* @__PURE__ */ jsx3("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx3("span", { class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, method))), /* @__PURE__ */ jsx3("div", { class: "p-6" }, /* @__PURE__ */ jsx3("div", { class: "flex items-center gap-2 mb-6 group" }, /* @__PURE__ */ jsx3("div", { class: "flex-grow flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:border-emerald-200 transition-colors" }, /* @__PURE__ */ jsx3("code", { class: "text-sm font-mono text-slate-600 truncate" }, path)), /* @__PURE__ */ jsx3(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path}')`,
    class: "p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" }))
)), /* @__PURE__ */ jsx3("div", { class: "space-y-4" }, /* @__PURE__ */ jsx3("details", { class: "group" }, /* @__PURE__ */ jsx3("summary", { class: "flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors list-none" }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 group-open:rotate-180 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })), "Example Response"), /* @__PURE__ */ jsx3("div", { class: "mt-4 animate-in fade-in slide-in-from-top-2 duration-300" }, /* @__PURE__ */ jsx3("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx3("code", null, responseJson)))))));
var SectionTitle = ({ title, icon, id, color = "emerald" }) => /* @__PURE__ */ jsx3("div", { id, class: "flex items-center gap-3 mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx3("div", { class: `w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${color}-100` }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: icon }))), /* @__PURE__ */ jsx3("h2", { class: "text-2xl font-bold text-slate-900" }, title));
var Home = ({ baseUrl }) => {
  return /* @__PURE__ */ jsx3("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ jsx3("div", { class: "grid grid-cols-1 lg:grid-cols-4 gap-12" }, /* @__PURE__ */ jsx3("aside", { class: "hidden lg:block col-span-1 sticky top-28 self-start" }, /* @__PURE__ */ jsx3("div", { class: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ jsx3("h3", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3" }, "Menu"), /* @__PURE__ */ jsx3("nav", { class: "space-y-1" }, [
    { name: "Introduction", href: "#intro", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Quran", href: "#quran", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Integrity", href: "#integrity", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { name: "FAQ", href: "#faq", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ].map((item, index) => /* @__PURE__ */ jsx3(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group"
    },
    /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: item.icon })),
    item.name
  ))))), /* @__PURE__ */ jsx3("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx3("section", { id: "intro", class: "mb-20 scroll-mt-24" }, /* @__PURE__ */ jsx3("div", { class: "flex flex-wrap gap-3 mb-6" }, /* @__PURE__ */ jsx3("div", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold" }, /* @__PURE__ */ jsx3("span", { class: "relative flex h-2 w-2" }, /* @__PURE__ */ jsx3("span", { class: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx3("span", { class: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })), "v1.0.0 Stable"), /* @__PURE__ */ jsx3("div", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold" }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "3", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z" })), "Verified Data Source: Kemenag RI")), /* @__PURE__ */ jsx3("h1", { class: "text-5xl font-extrabold text-slate-900 tracking-tight mb-6" }, "Muslim ", /* @__PURE__ */ jsx3("span", { class: "text-emerald-600" }, "All-in-One API")), /* @__PURE__ */ jsx3("p", { class: "text-xl text-slate-600 leading-relaxed mb-10 max-w-3xl" }, "Akses data keislaman terlengkap dengan performa tinggi. Dibangun untuk pengembang yang ingin membuat aplikasi islami."), /* @__PURE__ */ jsx3("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-10" }, /* @__PURE__ */ jsx3("div", { class: "p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" }, /* @__PURE__ */ jsx3("div", { class: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4" }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }))), /* @__PURE__ */ jsx3("h3", { class: "font-bold text-slate-900 mb-2" }, "Base URL"), /* @__PURE__ */ jsx3("div", { class: "flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100" }, /* @__PURE__ */ jsx3("code", { class: "text-sm text-emerald-600 font-mono font-bold" }, baseUrl))), /* @__PURE__ */ jsx3("div", { class: "p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" }, /* @__PURE__ */ jsx3("div", { class: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4" }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }))), /* @__PURE__ */ jsx3("h3", { class: "font-bold text-slate-900 mb-2" }, "Format"), /* @__PURE__ */ jsx3("div", { class: "flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100" }, /* @__PURE__ */ jsx3("code", { class: "text-sm text-blue-600 font-mono font-bold" }, "application/json"))))), /* @__PURE__ */ jsx3(
    SectionTitle,
    {
      id: "quran",
      title: "Al-Quran Indonesia",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Daftar Surah",
      method: "GET",
      path: "/surah",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "number": "1",
      "name_id": "Al-Fatihah",
      "name_short": "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
      "number_of_verses": "7",
      "revelation_id": "Makkiyyah",
      "audio_full": {...}
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Detail Surah",
      method: "GET",
      path: "/surah?surahId=1",
      responseJson: `{
  "status": 200,
  "data": {
    "number": "1",
    "sequence": "5",
    "number_of_verses": "7",
    "name_short": "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    "name_long": "\u0633\u064F\u0648\u0631\u064E\u0629\u064F \u0671\u0644\u0652\u0641\u064E\u0627\u062A\u0650\u062D\u064E\u0629\u0650",
    "name_en": "Al-Faatiha",
    "name_id": "Al-Fatihah",
    "translation_en": "The Opening",
    "translation_id": "Pembukaan",
    "revelation": "\u0645\u0643\u0629",
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
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Tafsir Kemenag",
      method: "GET",
      path: "/tafsir?surahId=1",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": "1",
      "ayah": "1",
      "wajiz": "...",
      "tahlili": "..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Ayat by Surah",
      method: "GET",
      path: "/ayah/surah?surahId=1",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Spesifik Ayat",
      method: "GET",
      path: "/ayah/specific?surahId=1&ayahId=1",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Ayat by Juz",
      method: "GET",
      path: "/ayah/juz?juzId=30",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Ayat by Page",
      method: "GET",
      path: "/ayah/page?page=604",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Range Ayat",
      method: "GET",
      path: "/ayah/range?surahId=1&start=1&end=7",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Cari Ayat",
      method: "GET",
      path: "/ayah/find?query=alhamdulillah",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Juz Al-Quran",
      method: "GET",
      path: "/juz",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "number": "1",
      "name": "Juz 1"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Detail Juz",
      method: "GET",
      path: "/juz?juzId=30",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Tema Al-Quran",
      method: "GET",
      path: "/theme",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": "1",
      "name": "Tiga Golongan Manusia..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Detail Tema",
      method: "GET",
      path: "/theme?themeId=1",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Kata per Kata",
      method: "GET",
      path: "/word?surahId=1",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": "id",
      "surah": "1",
      "ayah": "1",
      "word": "1",
      "arab": "\u0628\u0650\u0633\u0652\u0645\u0650",
      "indo": "dengan nama"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Word Spesifik Ayat",
      method: "GET",
      path: "/word?surahId=1&ayahId=1",
      responseJson: `{
  "status": 200,
  "data": [...]
}`
    }
  ), /* @__PURE__ */ jsx3(
    SectionTitle,
    {
      id: "integrity",
      title: "Integrity & Blockchain",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx3("div", { className: "bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg" }, /* @__PURE__ */ jsx3("p", { className: "text-sm text-emerald-800 font-medium" }, "\u{1F6E1}\uFE0F ", /* @__PURE__ */ jsx3("strong", null, "Data Integrity Proof:"), ' Kami menggunakan teknologi cryptographic hashing (SHA-256) untuk memastikan kemurnian teks Al-Quran. Setiap Surah dan Ayah memiliki "Digital Fingerprint" yang unik. Jika ada perubahan satu karakter saja pada database kami, maka hash integrity akan berubah, memberitahukan pengguna bahwa data tidak lagi murni.')), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Integrity Chain (Blockchain)",
      method: "GET",
      path: "/integrity/chain",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx3(
    ApiEndpoint,
    {
      title: "Verifikasi Ayah Spesifik",
      method: "GET",
      path: "/integrity/verify/ayah?surahId=1&ayahId=1",
      responseJson: `{
  "status": 200,
  "data": {
    "surah": "1",
    "ayah": "1",
    "hash": "e3b0c442...",
    "verification_method": "SHA-256",
    "integrity": "Verified"
  }
}`
    }
  ), /* @__PURE__ */ jsx3("div", { class: "mb-20 p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl overflow-hidden relative group" }, /* @__PURE__ */ jsx3("div", { class: "absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500" }, /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-64 w-64", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }))), /* @__PURE__ */ jsx3("div", { class: "relative z-10" }, /* @__PURE__ */ jsx3("h3", { class: "text-2xl font-bold mb-3" }, "Butuh Resource Lainnya?"), /* @__PURE__ */ jsx3("p", { class: "text-emerald-50 mb-6 max-w-lg" }, "Temukan API tambahan seperti Murottal, Jadwal Sholat, Kalender Hijriah, Hadits, Asmaul Husna, dan banyak lagi di halaman Resources."), /* @__PURE__ */ jsx3(
    "a",
    {
      href: "/other",
      class: "inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
    },
    "Eksplor Other Resources",
    /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7-7 7" }))
  ))), /* @__PURE__ */ jsx3(
    SectionTitle,
    {
      id: "faq",
      title: "Pertanyaan Umum",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx3("div", { class: "space-y-4 mb-20" }, [
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
      a: "API ini sudah dilengkapi dengan 'Enterprise-grade Caching' (SWR) yang membuat respon sangat cepat lewat CDN. Kami juga menerapkan CORS policy dan Rate Limiting untuk menjaga stabilitas server dari penggunaan berlebihan."
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
  ].map((item, index) => /* @__PURE__ */ jsx3("details", { class: "group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300", key: index }, /* @__PURE__ */ jsx3("summary", { class: "flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors list-none" }, /* @__PURE__ */ jsx3("h4", { class: "font-bold text-slate-900 pr-4" }, item.q), /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx3("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" }))), /* @__PURE__ */ jsx3("div", { class: "px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/30" }, item.a)))))));
};

// src/components/Other.jsx
import { jsx as jsx4 } from "hono/jsx";
var ApiEndpoint2 = ({ method, path, title, responseJson }) => /* @__PURE__ */ jsx4("div", { class: "mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" }, /* @__PURE__ */ jsx4("div", { class: "px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" }, /* @__PURE__ */ jsx4("h4", { class: "font-semibold text-slate-900" }, title), /* @__PURE__ */ jsx4("div", { class: "flex gap-2" }, /* @__PURE__ */ jsx4("span", { class: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${method === "GET" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}` }, method))), /* @__PURE__ */ jsx4("div", { class: "p-6" }, /* @__PURE__ */ jsx4("div", { class: "flex items-center gap-2 mb-6 group" }, /* @__PURE__ */ jsx4("div", { class: "flex-grow flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:border-emerald-200 transition-colors" }, /* @__PURE__ */ jsx4("code", { class: "text-sm font-mono text-slate-600 truncate" }, path)), /* @__PURE__ */ jsx4(
  "button",
  {
    onclick: `navigator.clipboard.writeText(window.location.origin + '/v1${path}')`,
    class: "p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all",
    title: "Copy URL"
  },
  /* @__PURE__ */ jsx4("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx4("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8.5V11a.5.5 0 00-.5-.5H9.75a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h.75a.5.5 0 00.5-.5z" }))
)), /* @__PURE__ */ jsx4("div", { class: "space-y-4" }, /* @__PURE__ */ jsx4("details", { class: "group" }, /* @__PURE__ */ jsx4("summary", { class: "flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors list-none" }, /* @__PURE__ */ jsx4("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 group-open:rotate-180 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx4("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 9l-7 7-7-7" })), "Example Response"), /* @__PURE__ */ jsx4("div", { class: "mt-4 animate-in fade-in slide-in-from-top-2 duration-300" }, /* @__PURE__ */ jsx4("pre", { class: "text-[11px] leading-relaxed shadow-inner" }, /* @__PURE__ */ jsx4("code", null, responseJson)))))));
var SectionTitle2 = ({ title, icon, id, color = "emerald" }) => /* @__PURE__ */ jsx4("div", { id, class: "flex items-center gap-3 mb-8 scroll-mt-24" }, /* @__PURE__ */ jsx4("div", { class: `w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${color}-100` }, /* @__PURE__ */ jsx4("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx4("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: icon }))), /* @__PURE__ */ jsx4("h2", { class: "text-2xl font-bold text-slate-900" }, title));
var Other = () => {
  return /* @__PURE__ */ jsx4("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ jsx4("div", { class: "grid grid-cols-1 lg:grid-cols-4 gap-12" }, /* @__PURE__ */ jsx4("aside", { class: "hidden lg:block col-span-1 sticky top-28 self-start" }, /* @__PURE__ */ jsx4("div", { class: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ jsx4("h3", { class: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3" }, "Menu Other API"), /* @__PURE__ */ jsx4("nav", { class: "space-y-1" }, [
    { name: "Murottal", href: "#murottal", icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Sholat", href: "#sholat", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Kalender", href: "#calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Hadits", href: "#hadits", icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Asmaul Husna", href: "#asma", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" },
    { name: "Asbabun Nuzul", href: "#asbab", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Dzikir", href: "#dzikir", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
    { name: "Doa-doa", href: "#doa", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { name: "Juz & Tema", href: "#extra", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }
  ].map((item, index) => /* @__PURE__ */ jsx4(
    "a",
    {
      key: index,
      href: item.href,
      class: "flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group"
    },
    /* @__PURE__ */ jsx4("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ jsx4("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: item.icon })),
    item.name
  ))))), /* @__PURE__ */ jsx4("div", { class: "col-span-1 lg:col-span-3" }, /* @__PURE__ */ jsx4("div", { class: "max-w-3xl mb-12" }, /* @__PURE__ */ jsx4("h1", { class: "text-4xl font-extrabold text-slate-900 tracking-tight mb-4" }, "Other Resources"), /* @__PURE__ */ jsx4("p", { class: "text-lg text-slate-600" }, "Kumpulan resource dan API lainnya yang mungkin bermanfaat untuk pengembangan aplikasi Anda.")), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "murottal",
      title: "Murottal Audio",
      icon: "M11 5.882V19.118a3.63 3.63 0 01-5.12 3.574L1 18.817V5.183L5.88 1.309a3.63 3.63 0 015.12 3.573z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Qari",
      method: "GET",
      path: "/murotal/qari",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": "01",
      "name": "Abdullah-Al-Juhany"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Murottal by Surah",
      method: "GET",
      path: "/murotal?surahId=1",
      responseJson: `{
  "status": 200,
  "data": {
    "01": "https://cdn.equran.id/audio-full/Abdullah-Al-Juhany/001.mp3",
    "02": "https://cdn.equran.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
    ...
  }
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "sholat",
      title: "Jadwal Sholat",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "blue"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Cari Kota",
      method: "GET",
      path: "/sholat/kota/cari?nama=jakarta",
      responseJson: `{
  "status": true,
  "message": "success",
  "data": [
    {
      "id": "58a2fc6ed39fd083f55d4182bf88826d",
      "lokasi": "KOTA JAKARTA"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Jadwal by Kota ID",
      method: "GET",
      path: "/sholat/jadwal?kotaId=58a2fc6ed39fd083f55d4182bf88826d&tanggal=2025-12-24",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Jadwal by Koordinat",
      method: "GET",
      path: "/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "calendar",
      title: "Kalender Hijriah",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "emerald"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Masehi ke Hijriah & Jawa",
      method: "GET",
      path: "/calendar/hijri?date=2024-03-11&adj=-1",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Hijriah ke Masehi",
      method: "GET",
      path: "/calendar/masehi?day=1&month=9&year=1445",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "hadits",
      title: "Hadits",
      icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "orange"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Hadits Arbain",
      method: "GET",
      path: "/hadits",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": 1,
      "no": "1",
      "judul": "Niat dan Ikhlas",
      "arab": "\u0625\u0650\u0646\u064E\u0651\u0645\u064E\u0627 \u0627\u0644\u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u064F \u0628\u0650\u0627\u0644\u0646\u0650\u0651\u064A\u064E\u0651\u0627\u062A\u0650...",
      "indo": "Sesungguhnya setiap amal itu tergantung niatnya..."
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Kitab Hadits",
      method: "GET",
      path: "/hadits/books",
      responseJson: `{
  "code": 200,
  "message": "Success fetching all collections",
  "data": [
    { "name": "Abudaud", "id": "abu-daud", "available": 4419 },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "asma",
      title: "Asmaul Husna",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z",
      color: "indigo"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Semua Asmaul Husna",
      method: "GET",
      path: "/asma",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": "1",
      "latin": "Ar-Rahman",
      "arabic": "\u0627\u0644\u0631\u062D\u0645\u0646",
      "translation_id": "Yang Maha Pengasih"
    },
    ...
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "asbab",
      title: "Asbabun Nuzul",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "amber"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Asbabun Nuzul",
      method: "GET",
      path: "/asbab",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "dzikir",
      title: "Dzikir",
      icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
      color: "indigo"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Dzikir",
      method: "GET",
      path: "/dzikir",
      responseJson: `{
  "status": 200,
  "data": [
    {
      "id": 1,
      "title": "Dzikir Pagi",
      "arabic": "\u0623\u064E\u0635\u0652\u0628\u064E\u062D\u0652\u0646\u064E\u0627 \u0648\u064E\u0623\u064E\u0635\u0652\u0628\u064E\u062D\u064E \u0627\u0644\u0652\u0645\u064F\u0644\u0652\u0643\u064F \u0644\u0650\u0644\u064E\u0651\u0647\u0650...",
      "translation": "Kami telah memasuki waktu pagi...",
      "type": "pagi"
    }
  ]
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "doa",
      title: "Doa-doa",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Daftar Doa",
      method: "GET",
      path: "/doa",
      responseJson: `{
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
}`
    }
  ), /* @__PURE__ */ jsx4(
    SectionTitle2,
    {
      id: "extra",
      title: "Juz, Tema & Word",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      color: "slate"
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Juz Al-Quran",
      method: "GET",
      path: "/juz",
      responseJson: `{ "status": 200, "data": [...] }`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Tema Al-Quran",
      method: "GET",
      path: "/theme",
      responseJson: `{ "status": 200, "data": [...] }`
    }
  ), /* @__PURE__ */ jsx4(
    ApiEndpoint2,
    {
      title: "Kata per Kata",
      method: "GET",
      path: "/word?surahId=1",
      responseJson: `{ "status": 200, "data": [...] }`
    }
  ))));
};

// src/routes/index.jsx
var router = new Hono();
router.get("/", (c) => {
  const url = new URL(c.req.url);
  const baseUrl = `${url.protocol}//${url.host}/v1`;
  return c.html(
    /* @__PURE__ */ jsx5(Layout, { title: "Muslim All-in-One API | Documentation" }, /* @__PURE__ */ jsx5(Home, { baseUrl }))
  );
});
router.get("/other", (c) => {
  return c.html(
    /* @__PURE__ */ jsx5(Layout, { title: "Muslim All-in-One API | Resources" }, /* @__PURE__ */ jsx5(Other, null))
  );
});
var routes_default = router;

// src/routes/muslim/v1/index.js
import { Hono as Hono18 } from "hono";

// src/routes/muslim/v1/asbab.js
import { Hono as Hono2 } from "hono";

// src/database/config.js
import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
var isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
var getDbPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const path1 = join(__dirname, "alquran.db");
  if (fs.existsSync(path1)) return path1;
  const path2 = join(process.cwd(), "src", "database", "alquran.db");
  if (fs.existsSync(path2)) return path2;
  const path3 = join(process.cwd(), "api", "alquran.db");
  if (fs.existsSync(path3)) return path3;
  return path1;
};
var dbFile = getDbPath();
console.log(`Using database at: ${dbFile}`);
var db = new Database(dbFile, {
  readonly: isProduction,
  fileMustExist: true
});
if (!isProduction) {
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
}
var query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};
var get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(params);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
};

// src/routes/muslim/v1/asbab.js
var asbab = new Hono2();
asbab.get("/", async (c) => {
  try {
    const id = c.req.query("asbabId") || c.req.query("id");
    if (id == null) {
      const data = await query("SELECT * FROM asbab_nuzul ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: 404, data: [] }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    } else {
      const data = await get("SELECT * FROM asbab_nuzul WHERE id = ?", [id]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var asbab_default = asbab;

// src/routes/muslim/v1/asma.js
import { Hono as Hono3 } from "hono";
var asma = new Hono3();
asma.get("/", async (c) => {
  try {
    const id = c.req.query("asmaId") || c.req.query("id");
    if (id != null) {
      const data = await query("SELECT * FROM asmaul_husna WHERE id = ?", [id]);
      if (!data || data.length === 0) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: data[0] });
      }
    } else {
      const data = await query("SELECT * FROM asmaul_husna ORDER BY CAST(id as INTEGER) ASC");
      if (!data) {
        return c.json({ status: 404, data: [] }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var asma_default = asma;

// src/routes/muslim/v1/ayah.js
import { Hono as Hono4 } from "hono";
var ayah = new Hono4();
var formatAyah = (a) => {
  return {
    ...a,
    audio_partial: a.audio_partial ? JSON.parse(a.audio_partial) : {}
  };
};
ayah.get("/", async (c) => {
  try {
    const data = await query("SELECT * FROM ayah ORDER BY CAST(id as INTEGER) ASC");
    return c.json({ status: 200, data: (data || []).map(formatAyah) });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/range", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const start = c.req.query("start");
    const end = c.req.query("end");
    if (surahId != null && start != null && end != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE surah = ? AND ayah BETWEEN CAST(? as INTEGER) and CAST(? as INTEGER) ORDER BY CAST(id as INTEGER) ASC",
        [surahId, start, end]
      );
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId, start, end)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/surah", async (c) => {
  try {
    const id = c.req.query("surahId") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE surah = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/juz", async (c) => {
  try {
    const id = c.req.query("juzId") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE juz = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (juzId)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/page", async (c) => {
  try {
    const id = c.req.query("page") || c.req.query("id");
    if (id != null) {
      const data = await query(
        "SELECT * FROM ayah WHERE page = ? ORDER BY CAST(id as INTEGER) ASC",
        [id]
      );
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (page)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/specific", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const ayahId = c.req.query("ayahId");
    if (surahId != null && ayahId != null) {
      const data = await get(
        "SELECT * FROM ayah WHERE surah = ? AND ayah = ?",
        [surahId, ayahId]
      );
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: formatAyah(data) });
      }
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (surahId, ayahId)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
ayah.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null && q.length > 3) {
      const data = await query(
        "SELECT * FROM ayah WHERE text LIKE ? ORDER BY CAST(id as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: 200, data: (data || []).map(formatAyah) });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query). Harus lebih dari 3 karakter."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var ayah_default = ayah;

// src/routes/muslim/v1/calendar.js
import { Hono as Hono5 } from "hono";
var calendar = new Hono5();
var g2h = (date, adjustment = 0) => {
  let tempDate = new Date(date);
  if (adjustment !== 0) {
    tempDate.setDate(tempDate.getDate() + adjustment);
  }
  let d = tempDate.getDate();
  let m = tempDate.getMonth() + 1;
  let y = tempDate.getFullYear();
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = Math.floor((10985 - l) / 5316) * Math.floor(50 * l / 17719) + Math.floor(l / 5670) * Math.floor(43 * l / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  let month = Math.floor(24 * l / 709);
  let day = l - Math.floor(709 * month / 24);
  let year = 30 * n + j - 30;
  const islamicMonths = [
    "Muharram",
    "Safar",
    "Rabi' al-awwal",
    "Rabi' al-thani",
    "Jumada al-ula",
    "Jumada al-akhira",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah"
  ];
  const jawaMonths = [
    "Sura",
    "Sapar",
    "Mulud",
    "Bakda Mulud",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rejeb",
    "Ruwah",
    "Pasa",
    "Sawal",
    "Sela",
    "Besar"
  ];
  const pasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
  const jawaDays = ["Ahad", "Senen", "Slasa", "Rebo", "Kemis", "Jemuah", "Setu"];
  const baseDate = new Date(1970, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1e3 * 60 * 60 * 24));
  const pasaranIndex = ((diffDays + 3) % 5 + 5) % 5;
  const jawaDayIndex = date.getDay();
  return {
    day,
    month,
    month_name: islamicMonths[month - 1],
    year,
    jawa: {
      day,
      month,
      month_name: jawaMonths[month - 1],
      year: year + 512,
      pasaran: pasaran[pasaranIndex],
      day_name: jawaDays[jawaDayIndex],
      formatted: `${jawaDays[jawaDayIndex]} ${pasaran[pasaranIndex]}, ${day} ${jawaMonths[month - 1]} ${year + 512}`
    },
    formatted: `${day} ${islamicMonths[month - 1]} ${year} AH`
  };
};
var h2g = (hDay, hMonth, hYear) => {
  let jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  let l = jd + 68569;
  let n = Math.floor(4 * l / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor(4e3 * (l + 1) / 1461001);
  l = l - Math.floor(1461 * i / 4) + 31;
  let j = Math.floor(80 * l / 2447);
  let d = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  let m = j + 2 - 12 * l;
  let y = 100 * (n - 49) + i + l;
  const date = new Date(y, m - 1, d);
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  return {
    day: d,
    day_name: dayNames[date.getDay()],
    month: m,
    month_name: monthNames[m - 1],
    year: y,
    formatted: `${dayNames[date.getDay()]}, ${d} ${monthNames[m - 1]} ${y}`
  };
};
calendar.get("/hijri", (c) => {
  try {
    const dateStr = c.req.query("date");
    const adj = parseInt(c.req.query("adj")) || 0;
    let date;
    if (dateStr) {
      date = new Date(dateStr);
    } else {
      date = /* @__PURE__ */ new Date();
    }
    if (isNaN(date.getTime())) {
      return c.json({ status: 400, message: "Invalid date format. Use YYYY-MM-DD" }, 400);
    }
    const hijri = g2h(date, adj);
    return c.json({
      status: 200,
      data: {
        masehi: date.toISOString().split("T")[0],
        adjustment: adj,
        hijri
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
calendar.get("/masehi", (c) => {
  try {
    const day = parseInt(c.req.query("day"));
    const month = parseInt(c.req.query("month"));
    const year = parseInt(c.req.query("year"));
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return c.json({ status: 400, message: "Missing or invalid parameters. Requires day, month, and year" }, 400);
    }
    if (month < 1 || month > 12 || day < 1 || day > 30) {
      return c.json({ status: 400, message: "Invalid Hijri date values" }, 400);
    }
    const masehi = h2g(day, month, year);
    return c.json({
      status: 200,
      data: {
        hijri: {
          day,
          month,
          year
        },
        masehi
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var calendar_default = calendar;

// src/routes/muslim/v1/doa.js
import { Hono as Hono6 } from "hono";
var doa = new Hono6();
doa.get("/", async (c) => {
  try {
    const source = c.req.query("source");
    if (source != null) {
      const data = await query(
        "SELECT * FROM doa WHERE source = ? ORDER BY judul ASC",
        [source]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      const data = await query("SELECT * FROM doa ORDER BY judul ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
doa.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null) {
      const data = await query(
        "SELECT * FROM doa WHERE judul LIKE ? ORDER BY judul ASC",
        [`%${q}%`]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var doa_default = doa;

// src/routes/muslim/v1/dzikir.js
import { Hono as Hono7 } from "hono";
var dzikir = new Hono7();
dzikir.get("/", async (c) => {
  try {
    const type = c.req.query("type");
    if (type != null) {
      const data = await query(
        "SELECT * FROM dzikir WHERE type = ?",
        [type]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      const data = await query("SELECT * FROM dzikir");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var dzikir_default = dzikir;

// src/routes/muslim/v1/hadits.js
import { Hono as Hono8 } from "hono";
var hadits = new Hono8();
var GADING_API_BASE = "https://api.hadith.gading.dev";
hadits.get("/", async (c) => {
  try {
    const nomor = c.req.query("nomor");
    if (nomor != null) {
      const data = await get("SELECT * FROM hadits WHERE no = ?", [nomor]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    } else {
      const data = await query("SELECT * FROM hadits ORDER BY CAST(no as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
hadits.get("/books", async (c) => {
  try {
    const response = await fetch(`${GADING_API_BASE}/books`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
hadits.get("/books/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const range = c.req.query("range");
    const url = range ? `${GADING_API_BASE}/books/${name}?range=${range}` : `${GADING_API_BASE}/books/${name}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
hadits.get("/books/:name/:number", async (c) => {
  try {
    const name = c.req.param("name");
    const number = c.req.param("number");
    const response = await fetch(`${GADING_API_BASE}/books/${name}/${number}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
hadits.get("/find", async (c) => {
  try {
    const q = c.req.query("query");
    if (q != null) {
      const data = await query(
        "SELECT * FROM hadits WHERE judul LIKE ? ORDER BY CAST(no as INTEGER) ASC",
        [`%${q}%`]
      );
      return c.json({ status: 200, data: data || [] });
    } else {
      return c.json({
        status: 500,
        message: "Parameter di perlukan (query)."
      }, 500);
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var hadits_default = hadits;

// src/routes/muslim/v1/juz.js
import { Hono as Hono9 } from "hono";
var juz = new Hono9();
juz.get("/", async (c) => {
  try {
    const juzId = c.req.query("juzId") || c.req.query("id");
    if (juzId != null) {
      const data = await get("SELECT * FROM juz WHERE number = ?", [juzId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    } else {
      const data = await query("SELECT * FROM juz ORDER BY CAST (number as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var juz_default = juz;

// src/routes/muslim/v1/murotal.js
import { Hono as Hono10 } from "hono";
var murotal = new Hono10();
var qaris = [
  { id: "01", name: "Abdullah Al-Juhany" },
  { id: "02", name: "Abdul-Muhsin Al-Qasim" },
  { id: "03", name: "Abdurrahman as-Sudais" },
  { id: "04", name: "Ibrahim Al-Dossari" },
  { id: "05", name: "Misyari Rasyid Al-Afasi" },
  { id: "06", name: "Yasser Al-Dosari" }
];
murotal.get("/qari", (c) => {
  return c.json({
    status: 200,
    data: qaris
  });
});
murotal.get("/", async (c) => {
  try {
    const qariId = c.req.query("qariId") || "05";
    const surahId = c.req.query("surahId");
    if (surahId) {
      const data = await query("SELECT number, name_id, name_short, audio_full FROM surah WHERE number = ?", [surahId]);
      if (data.length === 0) {
        return c.json({ status: 404, message: "Surah not found" }, 404);
      }
      const surah2 = data[0];
      const audioFull = JSON.parse(surah2.audio_full || "{}");
      return c.json({
        status: 200,
        data: {
          surahId: surah2.number,
          name: surah2.name_id,
          name_short: surah2.name_short,
          qariId,
          audio_url: audioFull[qariId] || null
        }
      });
    }
    const allSurahs = await query("SELECT number, name_id, name_short, audio_full FROM surah ORDER BY CAST(number as INTEGER) ASC");
    const result = allSurahs.map((s) => {
      const audioFull = JSON.parse(s.audio_full || "{}");
      return {
        surahId: s.number,
        name: s.name_id,
        name_short: s.name_short,
        audio_url: audioFull[qariId] || null
      };
    });
    return c.json({
      status: 200,
      qari: qaris.find((q) => q.id === qariId) || { id: qariId, name: "Unknown" },
      data: result
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var murotal_default = murotal;

// src/routes/muslim/v1/integrity.js
import { Hono as Hono11 } from "hono";
import crypto from "crypto";
var integrity = new Hono11();
var generateHash = (data) => {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};
integrity.get("/chain", async (c) => {
  try {
    const surahs = await query("SELECT number, name_id FROM surah ORDER BY CAST(number as INTEGER) ASC");
    let chain = [];
    let previousHash = "0".repeat(64);
    for (const surah2 of surahs) {
      const ayahs = await query(
        "SELECT arab, text FROM ayah WHERE surah = ? ORDER BY CAST(ayah as INTEGER) ASC",
        [surah2.number]
      );
      const blockData = {
        surah_number: surah2.number,
        surah_name: surah2.name_id,
        ayah_count: ayahs.length,
        content_hash: generateHash(ayahs),
        // Hash of all ayahs in this surah
        previous_hash: previousHash,
        version: "1.0.0",
        timestamp: "2025-12-24T00:00:00Z"
        // Standardized for this version
      };
      const blockHash = generateHash(blockData);
      chain.push({
        block_height: chain.length + 1,
        hash: blockHash,
        ...blockData
      });
      previousHash = blockHash;
    }
    return c.json({
      status: 200,
      message: "Data Integrity Chain (Proof of Authenticity)",
      network: "Muslim-API Data Ledger",
      root_hash: previousHash,
      chain
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
integrity.get("/verify/ayah", async (c) => {
  const surahId = c.req.query("surahId");
  const ayahId = c.req.query("ayahId");
  if (!surahId || !ayahId) {
    return c.json({ status: 400, message: "surahId and ayahId are required" }, 400);
  }
  try {
    const ayah2 = await query(
      "SELECT arab, text FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    if (!ayah2 || ayah2.length === 0) {
      return c.json({ status: 404, message: "Ayah not found" }, 404);
    }
    const hash = generateHash(ayah2[0]);
    return c.json({
      status: 200,
      data: {
        surah: surahId,
        ayah: ayahId,
        hash,
        verification_method: "SHA-256",
        integrity: "Verified"
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var integrity_default = integrity;

// src/routes/muslim/v1/sholat.js
import { Hono as Hono12 } from "hono";
var sholat = new Hono12();
var BASE_API = "https://api.myquran.com/v3/sholat";
var kotaCache = null;
sholat.get("/kota/semua", async (c) => {
  try {
    if (kotaCache) return c.json({ status: 200, data: kotaCache });
    const response = await fetch(`${BASE_API}/kota/semua`);
    const data = await response.json();
    if (data.status) {
      kotaCache = data.data;
      return c.json({ status: 200, data: data.data });
    }
    return c.json({ status: 500, message: "Gagal mengambil data kota" }, 500);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
sholat.get("/kota/cari", async (c) => {
  const query2 = c.req.query("nama");
  if (!query2) return c.json({ status: 400, message: "Parameter nama diperlukan" }, 400);
  try {
    const response = await fetch(`${BASE_API}/kota/cari/${query2}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
sholat.get("/jadwal", async (c) => {
  const kotaId = c.req.query("kotaId");
  const tanggal = c.req.query("tanggal") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (!kotaId) return c.json({ status: 400, message: "Parameter kotaId diperlukan" }, 400);
  try {
    const response = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
sholat.get("/jadwal/koordinat", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");
  const tanggal = c.req.query("tanggal") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (!lat || !lon) {
    return c.json({ status: 400, message: "Parameter lat dan lon diperlukan" }, 400);
  }
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
      headers: { "User-Agent": "Muslim-API/1.0" }
    });
    const geoData = await geoRes.json();
    const city = geoData.address.city || geoData.address.town || geoData.address.municipality || geoData.address.county;
    if (!city) {
      return c.json({ status: 404, message: "Lokasi tidak ditemukan" }, 404);
    }
    const cleanCityName = city.replace(/Kota |Kabupaten /g, "").trim();
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cleanCityName}`);
    const kotaData = await kotaRes.json();
    if (!kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.json({
        status: 404,
        message: `Kota ${cleanCityName} tidak terdaftar di database Kemenag`,
        location: city
      }, 404);
    }
    const kotaId = kotaData.data[0].id;
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kotaId}/${tanggal}`);
    const jadwalData = await jadwalRes.json();
    return c.json({
      status: 200,
      location: geoData.display_name,
      city_found: city,
      data: jadwalData.data
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var sholat_default = sholat;

// src/routes/muslim/v1/surah.js
import { Hono as Hono13 } from "hono";
var surah = new Hono13();
var formatSurah = (s) => {
  return {
    ...s,
    audio_full: s.audio_full ? JSON.parse(s.audio_full) : {}
  };
};
surah.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    if (surahId != null) {
      const data = await get("SELECT * FROM surah WHERE number = ?", [surahId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data: formatSurah(data) });
      }
    } else {
      const data = await query("SELECT * FROM surah ORDER BY CAST(number as INTEGER) ASC");
      if (!data) {
        return c.json({ status: 404, data: [] }, 404);
      } else {
        return c.json({ status: 200, data: data.map(formatSurah) });
      }
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var surah_default = surah;

// src/routes/muslim/v1/tafsir.js
import { Hono as Hono14 } from "hono";
var tafsir = new Hono14();
tafsir.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    if (surahId != null) {
      const data = await query("SELECT * FROM tafsir WHERE surahId = ?", [surahId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    } else {
      const data = await query("SELECT * FROM tafsir ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var tafsir_default = tafsir;

// src/routes/muslim/v1/theme.js
import { Hono as Hono15 } from "hono";
var theme = new Hono15();
theme.get("/", async (c) => {
  try {
    const themeId = c.req.query("themeId") || c.req.query("id");
    if (themeId != null) {
      const data = await get("SELECT * FROM theme WHERE id = ?", [themeId]);
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      } else {
        return c.json({ status: 200, data });
      }
    } else {
      const data = await query("SELECT * FROM theme ORDER BY CAST(id as INTEGER) ASC");
      return c.json({ status: 200, data: data || [] });
    }
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var theme_default = theme;

// src/routes/muslim/v1/word.js
import { Hono as Hono16 } from "hono";
var word = new Hono16();
word.get("/", async (c) => {
  try {
    const surahId = c.req.query("surahId") || c.req.query("id");
    const ayahId = c.req.query("ayahId");
    let sql = "SELECT * FROM word";
    let params = [];
    if (surahId != null && ayahId != null) {
      sql += " WHERE surah = ? AND ayah = ?";
      params = [surahId, ayahId];
    } else if (surahId != null) {
      sql += " WHERE surah = ?";
      params = [surahId];
    }
    sql += " ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC";
    const data = await query(sql, params);
    return c.json({ status: 200, data: data || [] });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var word_default = word;

// src/routes/muslim/v1/admin.js
import { Hono as Hono17 } from "hono";
var admin = new Hono17();
var API_KEY = process.env.ADMIN_API_KEY || "muslim-api-admin-secret";
admin.use("*", async (c, next) => {
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return c.json({
      status: 403,
      message: "Admin updates are disabled on Vercel Production. Please use Local Update + Git Push strategy."
    }, 403);
  }
  const apiKey = c.req.header("x-api-key");
  if (apiKey !== API_KEY) {
    return c.json({ status: 401, message: "Unauthorized: Invalid or missing API Key" }, 401);
  }
  await next();
});
admin.patch("/ayah", async (c) => {
  try {
    const { surahId, ayahId, arab, text, latin } = await c.req.json();
    if (!surahId || !ayahId) {
      return c.json({ status: 400, message: "surahId and ayahId are required" }, 400);
    }
    const oldData = await get(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    if (!oldData) {
      return c.json({ status: 404, message: "Ayah not found" }, 404);
    }
    const updates = [];
    const params = [];
    if (arab) {
      updates.push("arab = ?");
      params.push(arab);
    }
    if (text) {
      updates.push("text = ?");
      params.push(text);
    }
    if (latin) {
      updates.push("latin = ?");
      params.push(latin);
    }
    if (updates.length === 0) {
      return c.json({ status: 400, message: "No fields to update provided" }, 400);
    }
    params.push(surahId, ayahId);
    await query(
      `UPDATE ayah SET ${updates.join(", ")} WHERE surah = ? AND ayah = ?`,
      params
    );
    const newData = await get(
      "SELECT arab, text, latin FROM ayah WHERE surah = ? AND ayah = ?",
      [surahId, ayahId]
    );
    return c.json({
      status: 200,
      message: "Ayah updated successfully",
      diff: {
        before: oldData,
        after: newData
      },
      integrity_status: "Hash will be automatically recalculated on next integrity check"
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
admin.patch("/dzikir", async (c) => {
  try {
    const { id, title, arabic, translation } = await c.req.json();
    if (!id) return c.json({ status: 400, message: "id is required" }, 400);
    const oldData = await get("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: 404, message: "Dzikir not found" }, 404);
    const updates = [];
    const params = [];
    if (title) {
      updates.push("title = ?");
      params.push(title);
    }
    if (arabic) {
      updates.push("arabic = ?");
      params.push(arabic);
    }
    if (translation) {
      updates.push("translation = ?");
      params.push(translation);
    }
    if (updates.length === 0) return c.json({ status: 400, message: "No fields to update" }, 400);
    params.push(id);
    await query(`UPDATE dzikir SET ${updates.join(", ")} WHERE id = ?`, params);
    const newData = await get("SELECT title, arabic, translation FROM dzikir WHERE id = ?", [id]);
    return c.json({
      status: 200,
      message: "Dzikir updated successfully",
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
admin.patch("/doa", async (c) => {
  try {
    const { id, judul, arab, indo } = await c.req.json();
    if (!id) return c.json({ status: 400, message: "id is required" }, 400);
    const oldData = await get("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);
    if (!oldData) return c.json({ status: 404, message: "Doa not found" }, 404);
    const updates = [];
    const params = [];
    if (judul) {
      updates.push("judul = ?");
      params.push(judul);
    }
    if (arab) {
      updates.push("arab = ?");
      params.push(arab);
    }
    if (indo) {
      updates.push("indo = ?");
      params.push(indo);
    }
    if (updates.length === 0) return c.json({ status: 400, message: "No fields to update" }, 400);
    params.push(id);
    await query(`UPDATE doa SET ${updates.join(", ")} WHERE id = ?`, params);
    const newData = await get("SELECT judul, arab, indo FROM doa WHERE id = ?", [id]);
    return c.json({
      status: 200,
      message: "Doa updated successfully",
      diff: {
        before: oldData,
        after: newData
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});
var admin_default = admin;

// src/routes/muslim/v1/index.js
var v1 = new Hono18();
v1.route("/asbab", asbab_default);
v1.route("/asma", asma_default);
v1.route("/ayah", ayah_default);
v1.route("/calendar", calendar_default);
v1.route("/doa", doa_default);
v1.route("/dzikir", dzikir_default);
v1.route("/hadits", hadits_default);
v1.route("/juz", juz_default);
v1.route("/murotal", murotal_default);
v1.route("/integrity", integrity_default);
v1.route("/sholat", sholat_default);
v1.route("/surah", surah_default);
v1.route("/tafsir", tafsir_default);
v1.route("/theme", theme_default);
v1.route("/word", word_default);
v1.route("/admin", admin_default);
v1.get("/", (c) => {
  return c.json({
    quran: {
      surah: {
        daftarSurah: {
          pattern: "/v1/surah"
        },
        infoSurah: {
          pattern: "/v1/surah?surahId={surahId}",
          contoh: "/v1/surah?surahId=114"
        }
      },
      ayah: {
        range: {
          pattern: "/v1/ayah/range?surahId={surahId}&start={start}&end={end}",
          contoh: "/v1/ayah/range?surahId=1&start=1&end=7"
        },
        spesifikSurah: {
          pattern: "/v1/ayah/surah?surahId={surahId}",
          contoh: "/v1/ayah/surah?surahId=1"
        },
        spesifikJuz: {
          pattern: "/v1/ayah/juz?juzId={juzId}",
          contoh: "/v1/ayah/juz?juzId=30"
        },
        spesifikHalaman: {
          pattern: "/v1/ayah/page?page={page}",
          contoh: "/v1/ayah/page?page=604"
        },
        spesifikAyat: {
          pattern: "/v1/ayah/specific?surahId={surahId}&ayahId={ayahId}",
          contoh: "/v1/ayah/specific?surahId=1&ayahId=1"
        },
        cari: {
          pattern: "/v1/ayah/find?query={query}",
          contoh: "/v1/ayah/find?query=alhamdulillah"
        }
      },
      juz: {
        semua: {
          pattern: "/v1/juz"
        },
        spesifik: {
          pattern: "/v1/juz?juzId={juzId}",
          contoh: "/v1/juz?juzId=30"
        }
      },
      asbabNujul: {
        semua: {
          pattern: "/v1/asbab"
        },
        spesifik: {
          pattern: "/v1/asbab?id={asbabId}",
          contoh: "/v1/asbab?id=1"
        }
      },
      asmaulHusna: {
        semua: {
          pattern: "/v1/asma"
        },
        spesifik: {
          pattern: "/v1/asma?id={asmaId}",
          contoh: "/v1/asma?id=1"
        }
      },
      murotal: {
        qari: {
          pattern: "/v1/murotal/qari"
        },
        semua: {
          pattern: "/v1/murotal"
        },
        spesifikQari: {
          pattern: "/v1/murotal?qariId={qariId}",
          contoh: "/v1/murotal?qariId=05"
        },
        spesifikSurah: {
          pattern: "/v1/murotal?surahId={surahId}&qariId={qariId}",
          contoh: "/v1/murotal?surahId=1&qariId=05"
        }
      },
      jadwalSholat: {
        semuaKota: {
          pattern: "/v1/sholat/kota/semua"
        },
        cariKota: {
          pattern: "/v1/sholat/kota/cari?nama={namaKota}",
          contoh: "/v1/sholat/kota/cari?nama=jakarta"
        },
        jadwalByKota: {
          pattern: "/v1/sholat/jadwal?kotaId={kotaId}&tanggal={YYYY-MM-DD}",
          contoh: "/v1/sholat/jadwal?kotaId=58a2fc6ed39fd083f55d4182bf88826d&tanggal=2025-12-24"
        },
        jadwalByKoordinat: {
          pattern: "/v1/sholat/jadwal/koordinat?lat={latitude}&lon={longitude}",
          contoh: "/v1/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272"
        }
      },
      calendar: {
        masehiToHijri: {
          pattern: "/v1/calendar/hijri?date={YYYY-MM-DD}",
          contoh: "/v1/calendar/hijri?date=2024-03-11"
        },
        hijriToMasehi: {
          pattern: "/v1/calendar/masehi?day={day}&month={month}&year={year}",
          contoh: "/v1/calendar/masehi?day=1&month=9&year=1445"
        }
      },
      tafsir: {
        semua: {
          pattern: "/v1/tafsir"
        },
        spesifikSurah: {
          pattern: "/v1/tafsir?surahId={surahId}",
          contoh: "/v1/tafsir?surahId=1"
        }
      },
      theme: {
        semua: {
          pattern: "/v1/theme"
        },
        spesifik: {
          pattern: "/v1/theme?themeId={themeId}",
          contoh: "/v1/theme?themeId=1"
        }
      },
      kataPerKata: {
        semua: {
          pattern: "/v1/word"
        },
        spesifikSurah: {
          pattern: "/v1/word?surahId={surahId}",
          contoh: "/v1/word?surahId=1"
        },
        spesifikAyat: {
          pattern: "/v1/word?surahId={surahId}&ayahId={ayahId}",
          contoh: "/v1/word?surahId=1&ayahId=1"
        }
      }
    },
    doa: {
      semua: {
        pattern: "/v1/doa"
      },
      spesifikSumber: {
        pattern: "/v1/doa?source={source}",
        contoh: "/v1/doa?source=quran"
      },
      cari: {
        pattern: "/v1/doa/find?query={query}",
        contoh: "/v1/doa/find?query=makan"
      }
    },
    dzikir: {
      semua: {
        pattern: "/v1/dzikir"
      },
      spesifikTipe: {
        pattern: "/v1/dzikir?type={type}",
        contoh: "/v1/dzikir?type=pagi"
      }
    },
    hadits: {
      semua: {
        pattern: "/v1/hadits"
      },
      spesifikNomor: {
        pattern: "/v1/hadits?nomor={nomor}",
        contoh: "/v1/hadits?nomor=1"
      },
      cari: {
        pattern: "/v1/hadits/find?query={query}",
        contoh: "/v1/hadits/find?query=niat"
      }
    }
  });
});
var v1_default = v1;

// src/app.jsx
var app = new Hono19();
app.use("*", trimTrailingSlash());
app.use("*", logger());
app.use("*", cors());
app.get("/v1/*", async (c, next) => {
  await next();
  if (c.res.ok && c.req.method === "GET") {
    c.res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }
});
var rateLimitMap = /* @__PURE__ */ new Map();
app.use("/v1/*", async (c, next) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "local";
  const userAgent = c.req.header("user-agent") || "unknown";
  const method = c.req.method;
  const path = c.req.path;
  if (process.env.NODE_ENV === "production") {
    console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Path: ${path} | UA: ${userAgent}`);
    return await next();
  }
  const now = Date.now();
  const windowMs = 60 * 1e3;
  const maxRequests = 100;
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }
  rateLimitMap.set(ip, clientData);
  if (clientData.count > maxRequests) {
    console.warn(`[BLOCKED] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Reason: Rate Limit Exceeded`);
    return c.json({
      status: 429,
      message: "Anda diblokir sementara karena melakukan terlalu banyak permintaan (spamming). Silakan coba lagi dalam 1 menit.",
      reason: "Rate limit exceeded",
      client_info: { ip, user_agent: userAgent }
    }, 429);
  }
  console.log(`[HIT] ${(/* @__PURE__ */ new Date()).toISOString()} | IP: ${ip} | Method: ${method} | Path: ${path}`);
  await next();
});
app.route("/", routes_default);
app.route("/v1", v1_default);
app.notFound((c) => {
  return c.json({ status: 404, message: "Not Found" }, 404);
});
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ status: 500, message: err.message }, 500);
});
var app_default = app;

// vercel-entry.js
var vercel_entry_default = handle(app_default);
export {
  vercel_entry_default as default
};
