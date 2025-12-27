/** @jsx jsx */
import { jsx } from "hono/jsx";
import { Search } from "./Search.jsx";
import fs from "node:fs";
import path from "node:path";

// Read compiled CSS once at startup
let compiledCss = "";
try {
  const cssPath = path.resolve(process.cwd(), "src/compiled.css");
  if (fs.existsSync(cssPath)) {
    compiledCss = fs.readFileSync(cssPath, "utf-8");
  }
} catch (e) {
  console.error("Failed to load compiled CSS:", e);
}

export const Layout = ({ children, title }) => {
  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23059669%22/><path d=%22M30 35v40c10-5 20-5 20 0V35c0-5-10-5-20 0zM70 35v40c-10-5-20-5-20 0V35c0-5 10-5 20 0z%22 fill=%22white%22/></svg>"
        />
        {compiledCss ? (
          <style dangerouslySetInnerHTML={{ __html: compiledCss }} />
        ) : (
          <script src="https://cdn.tailwindcss.com"></script>
        )}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.js"></script>
        {process.env.NODE_ENV === "development" && (
          <script type="module" src="/@vite/client"></script>
        )}
        <style>{`
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .font-mono {
            font-family: 'JetBrains Mono', monospace;
          }
          .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          #mobile-menu {
            transition: all 0.3s ease-in-out;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
          }
          #mobile-menu.open {
            max-height: 800px;
            opacity: 1;
            padding: 1rem 0;
          }
          pre {
            background: #1e293b;
            color: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }
          code {
            font-family: 'JetBrains Mono', monospace;
          }

          /* JSONEditor Custom Style for Modal */
          #modal-json-editor {
            border: none !important;
            height: 100% !important;
            width: 100% !important;
          }
          #modal-json-editor .jsoneditor {
            border: none !important;
          }
          #modal-json-editor .jsoneditor-menu {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
          }
          #modal-json-editor .jsoneditor-navigation-bar {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
          }
          #modal-json-editor .jsoneditor-outer {
            background-color: #0f172a !important;
            overflow: auto !important;
            position: relative !important;
          }
          #modal-json-editor .jsoneditor-tree {
            background-color: #0f172a !important;
            min-width: 100% !important;
          }
          #modal-json-editor .jsoneditor-tree-inner {
            min-width: max-content !important;
            padding-bottom: 50px !important;
          }
          #modal-json-editor .jsoneditor-content-wrapper {
            overflow: visible !important;
          }
          #modal-json-editor .jsoneditor-field,
          #modal-json-editor .jsoneditor-value {
            white-space: nowrap !important;
          }
          #modal-json-editor .jsoneditor-separator {
            background-color: transparent !important;
          }
          #modal-json-editor .jsoneditor-values {
            color: #10b981 !important;
          }
          #modal-json-editor .jsoneditor-readonly {
            color: #94a3b8 !important;
          }
          #modal-json-editor .jsoneditor-string {
            color: #10b981 !important;
          }
          #modal-json-editor .jsoneditor-number {
            color: #3b82f6 !important;
          }
          #modal-json-editor .jsoneditor-boolean {
            color: #f59e0b !important;
          }
          #modal-json-editor .jsoneditor-null {
            color: #ef4444 !important;
          }
          #modal-json-editor .jsoneditor-field {
            color: #e2e8f0 !important;
          }

          /* Custom Scrollbar for both wrapper and JSONEditor internals */
          .custom-scrollbar::-webkit-scrollbar,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-track,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-track {
            background: #0f172a;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-thumb,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover,
          #modal-json-editor .jsoneditor-outer::-webkit-scrollbar-thumb:hover,
          #modal-json-editor .jsoneditor-tree::-webkit-scrollbar-thumb:hover {
            background: #475569;
          }
        `}</style>
      </head>
      <body class="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Search />
        <header class="sticky top-0 z-50 border-b glass border-slate-200">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <a
                href="/"
                class="flex gap-2 items-center transition-all group shrink-0"
              >
                <div class="flex justify-center items-center w-8 h-8 bg-emerald-600 rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-emerald-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 transition-all group-hover:from-emerald-500 group-hover:to-teal-500">
                  Muslim API
                </span>
              </a>
              <div class="flex gap-1 items-center md:gap-4 lg:gap-4">
                {/* Real Search Input */}
                <div class="relative w-40 group md:w-64">
                  <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 transition-colors text-slate-400 group-focus-within:text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search-input-header"
                    oninput="window.handleSearch(this.value)"
                    onfocus="window.handleSearch(this.value)"
                    autocomplete="off"
                    placeholder="Search..."
                    class="block py-1.5 pr-3 pl-10 w-full text-sm rounded-lg border transition-all bg-slate-100 border-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />

                  {/* Results Dropdown */}
                  <div
                    id="search-results-dropdown"
                    class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
                  >
                    <div id="search-results-content" class="p-2">
                      <div class="py-4 text-xs text-center text-slate-400">
                        Type to search...
                      </div>
                    </div>
                  </div>
                </div>

                <nav class="hidden items-center space-x-8 md:flex">
                  <a
                    href="/"
                    class="font-medium transition-colors text-slate-600 hover:text-emerald-600"
                  >
                    Home
                  </a>

                  {/* Resources Dropdown */}
                  <div class="relative group">
                    <button class="flex gap-1 items-center py-4 font-medium transition-colors text-slate-600 group-hover:text-emerald-600">
                      Documentation
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 transition-transform group-hover:rotate-180"
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
                    </button>

                    <div class="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 z-[100]">
                      <div class="grid grid-cols-3 gap-8">
                        <div>
                          <h5 class="mb-4 text-xs font-bold tracking-wider uppercase text-slate-400">
                            Internal Services
                          </h5>
                          <ul class="space-y-3">
                            <li>
                              <a
                                href="/docs"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Al-Quran API
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Teks & Tafsir Kemenag
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/other"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-blue-600 bg-blue-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Jadwal Sholat
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Seluruh Indonesia
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/status"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-amber-600 bg-amber-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    System Status
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Uptime & Latency
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div class="col-span-2">
                          <h5 class="mb-4 text-xs font-bold tracking-wider uppercase text-slate-400">
                            Other API Resources
                          </h5>
                          <ul class="grid grid-cols-2 gap-y-4 gap-x-8">
                            <li>
                              <a
                                href="/other#hadits"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-rose-600 bg-rose-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Hadits & Tafsir
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Kumpulan Kitab & Tafsir
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/other#doa"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-purple-600 bg-purple-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Doa & Dzikir
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Harian & Pilihan
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/other#calendar"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-indigo-600 bg-indigo-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Kalender Hijriah
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    Konversi & Jadwal
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/other#asma"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-amber-600 bg-amber-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Asmaul Husna
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    99 Nama Allah
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="/other#kemenag"
                                class="flex gap-3 items-start group/item"
                              >
                                <div class="flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-50 rounded-lg transition-colors shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white">
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">
                                    Layanan Kemenag
                                  </div>
                                  <div class="text-xs text-slate-500">
                                    SIMAS, Pesantren & Libur
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href="/playground"
                    class="px-4 py-1.5 font-medium text-white bg-emerald-600 rounded-lg shadow-sm transition-all hover:bg-emerald-700 hover:shadow-emerald-200"
                  >
                    Playground
                  </a>
                </nav>

                <div class="md:hidden">
                  <button
                    type="button"
                    onclick="document.getElementById('mobile-menu').classList.toggle('open')"
                    class="p-2 rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div id="mobile-menu" class="border-t md:hidden border-slate-100">
              <nav class="flex flex-col px-2 pb-4 space-y-1">
                <a
                  href="/"
                  class="px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  Home
                </a>

                <div class="px-3 py-2 mt-2 text-xs font-bold tracking-wider uppercase text-slate-400">
                  Internal Services
                </div>
                <a
                  href="/docs"
                  class="flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{" "}
                  Al-Quran API
                </a>
                <a
                  href="/other"
                  class="flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Other
                  APIs
                </a>
                <a
                  href="/status"
                  class="flex gap-2 items-center px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <div class="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>{" "}
                  System Status
                </a>

                <div class="px-3 py-2 mt-2 text-xs font-bold tracking-wider uppercase text-slate-400">
                  External Resources
                </div>
                <a
                  href="https://quran.kemenag.go.id/"
                  target="_blank"
                  class="px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  Quran Kemenag
                </a>
                <a
                  href="https://github.com/vrush2000/muslim-all-in-one-api"
                  target="_blank"
                  class="px-3 py-2 font-medium rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  GitHub Repository
                </a>

                <a
                  href="/playground"
                  class="px-3 py-2.5 mt-4 font-bold text-center text-white bg-emerald-600 rounded-xl shadow-lg transition-all shadow-emerald-100"
                >
                  Open Playground
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main class="flex-grow">{children}</main>

        {/* Global API Preview Modal */}
        <div id="api-preview-modal" class="fixed inset-0 z-[200] hidden">
          <div
            class="absolute inset-0 backdrop-blur-sm bg-slate-900/60"
            onclick="window.closeApiModal()"
          ></div>
          <div class="flex absolute inset-0 justify-center items-center p-2 pointer-events-none sm:p-4">
            <div class="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-slate-200">
              {/* Header */}
              <div class="flex justify-between items-center px-4 py-3 border-b sm:px-6 sm:py-4 border-slate-100 bg-slate-50/50 shrink-0">
                <div class="flex overflow-hidden gap-2 items-center sm:gap-3">
                  <div class="flex justify-center items-center w-8 h-8 text-emerald-600 bg-emerald-100 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 sm:h-6 sm:w-6"
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
                  </div>
                  <div class="overflow-hidden">
                    <h3 class="text-sm font-bold truncate sm:text-lg text-slate-900">
                      API Response Preview
                    </h3>
                    <p
                      id="modal-endpoint-url"
                      class="text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-md md:max-w-xl"
                    ></p>
                  </div>
                </div>
                <button
                  onclick="window.closeApiModal()"
                  class="p-1.5 rounded-lg transition-all sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div class="flex overflow-hidden flex-col flex-grow gap-3 p-4 sm:p-6 sm:gap-4">
                <div class="flex flex-col gap-3 justify-between sm:flex-row sm:items-center shrink-0">
                  <div class="flex gap-3 items-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      GET
                    </span>
                    <span
                      id="modal-status-badge"
                      class="hidden inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                    ></span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <button
                      onclick="window.copyModalResponse()"
                      class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] sm:text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 sm:border-transparent rounded-lg transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Copy JSON
                    </button>
                    <a
                      id="modal-full-playground"
                      href="#"
                      class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-100 sm:border-transparent rounded-lg transition-all"
                    >
                      Playground
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div class="flex-grow overflow-hidden relative custom-scrollbar flex flex-col bg-[#0f172a] rounded-lg sm:rounded-xl border border-slate-700">
                  <pre
                    id="modal-json-pure"
                    class="flex-grow h-full w-full p-4 sm:p-6 text-emerald-400 font-mono text-[11px] sm:text-sm overflow-auto custom-scrollbar whitespace-pre"
                  ></pre>
                </div>
              </div>

              {/* Footer */}
              <div class="flex px-4 py-3 border-t sm:px-6 sm:py-4 border-slate-100 bg-slate-50/50 shrink-0">
                <button
                  onclick="window.closeApiModal()"
                  class="px-6 py-2 w-full font-bold text-white rounded-lg shadow-lg transition-all sm:w-auto sm:ml-auto bg-slate-900 sm:rounded-xl hover:bg-slate-800 shadow-slate-200"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          let modalJsonData = null;
          
          window.openApiModal = async function(category, endpointId, url) {
            const modal = document.getElementById('api-preview-modal');
            const jsonDisplay = document.getElementById('modal-json-pure');
            const urlDisplay = document.getElementById('modal-endpoint-url');
            const playgroundLink = document.getElementById('modal-full-playground');
            const statusBadge = document.getElementById('modal-status-badge');
            
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            urlDisplay.textContent = url;
            playgroundLink.href = '/playground?category=' + category + '&endpoint=' + endpointId;
            
            jsonDisplay.textContent = 'Loading response...';
            statusBadge.classList.add('hidden');
            
            try {
              const start = performance.now();
              const response = await fetch(url);
              const data = await response.json();
              const end = performance.now();
              
              modalJsonData = data;
              jsonDisplay.textContent = JSON.stringify(data, null, 2);
              
              statusBadge.textContent = response.status + ' ' + response.statusText + ' (' + Math.round(end - start) + 'ms)';
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full' + 
                (response.ok ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800');
              statusBadge.classList.remove('hidden');
            } catch (error) {
              jsonDisplay.textContent = JSON.stringify({ error: 'Failed to fetch API', details: error.message }, null, 2);
              statusBadge.textContent = 'Error';
              statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full';
              statusBadge.classList.remove('hidden');
            }
          };
          
          window.closeApiModal = function() {
            const modal = document.getElementById('api-preview-modal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          };
          
          window.copyModalResponse = function() {
            if (modalJsonData) {
              const json = JSON.stringify(modalJsonData, null, 2);
              navigator.clipboard.writeText(json).then(() => {
                const btn = event.currentTarget;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Copied!';
                setTimeout(() => btn.innerHTML = originalText, 2000);
              });
            }
          };
          
          // Close modal on ESC key
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              window.closeApiModal();
              window.closeDonationModal();
            }
          });

          window.openDonationModal = function() {
            const modal = document.getElementById('donation-modal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            window.resetDonationModal();
          };

          window.closeDonationModal = function() {
            const modal = document.getElementById('donation-modal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          };

          window.resetDonationModal = function() {
            document.getElementById('qris-display-section').classList.add('hidden');
            document.getElementById('donation-options-section').classList.remove('hidden');
            document.getElementById('custom-amount').value = '';
            document.getElementById('qris-image').src = '';
          };

          window.selectPreset = function(amount) {
            document.getElementById('custom-amount').value = amount;
            window.generateDonationQR();
          };

          window.generateDonationQR = async function() {
            const amount = document.getElementById('custom-amount').value;
            if (!amount || amount < 1000) {
              alert('Pilih atau masukan nominal donasi');
              return;
            }

            const generateBtn = document.getElementById('generate-qris-btn');
            const originalText = generateBtn.innerHTML;
            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Generating...';

            try {
              const response = await fetch("/api/qris/generate?amount=" + amount);
              const result = await response.json();

              if (result.status === 200) {
                document.getElementById('donation-options-section').classList.add('hidden');
                document.getElementById('qris-display-section').classList.remove('hidden');
                document.getElementById('qris-image').src = result.data.qr_image;
                document.getElementById('display-amount').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
              } else {
                alert('Gagal generate QRIS: ' + result.message);
              }
            } catch (error) {
              alert('Terjadi kesalahan: ' + error.message);
            } finally {
              generateBtn.disabled = false;
              generateBtn.innerHTML = originalText;
            }
          };
        `,

          }}
        />

        <footer class="py-12 mt-12 bg-white border-t border-slate-200">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
              <div class="col-span-1 md:col-span-1">
                <div class="flex gap-2 items-center mb-4">
                  <div class="flex justify-center items-center w-6 h-6 bg-emerald-600 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span class="text-lg font-bold">Muslim API</span>
                </div>
                <p class="mb-4 text-sm leading-relaxed text-slate-500">
                  Penyedia layanan API Muslim gratis untuk mempermudah
                  pengembang dalam membangun aplikasi islami.
                </p>
                <div class="flex gap-3 items-center">
                  <a
                    href="https://github.com/vrush2000/muslim-all-in-one-api"
                    target="_blank"
                    class="p-2 rounded-lg transition-all bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600"
                    title="GitHub Repository"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="/status"
                    class="p-2 rounded-lg transition-all bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600"
                    title="System Status"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 class="mb-4 font-semibold text-slate-900">
                  API Documentation
                </h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li>
                    <a href="/docs" class="hover:text-emerald-600">
                      Al-Quran API
                    </a>
                  </li>
                  <li>
                    <a href="/other#hadits" class="hover:text-emerald-600">
                      Hadits & Doa
                    </a>
                  </li>
                  <li>
                    <a href="/other#sholat" class="hover:text-emerald-600">
                      Jadwal Sholat
                    </a>
                  </li>
                  <li>
                    <a href="/other#kemenag" class="hover:text-emerald-600">
                      Kemenag Data
                    </a>
                  </li>
                  <li>
                    <a href="/other#sejarah" class="hover:text-emerald-600">
                      Sejarah Islam
                    </a>
                  </li>
                  <li>
                    <a
                      href="/playground"
                      class="font-semibold text-emerald-600 hover:underline"
                    >
                      API Playground
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="mb-4 font-semibold text-slate-900">
                  Official Sources
                </h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li>
                    <a
                      href="https://quran.kemenag.go.id/"
                      target="_blank"
                      class="flex gap-1 items-center hover:text-emerald-600"
                    >
                      Quran Kemenag{" "}
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://equran.id/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      equran.id (Audio)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://api.myquran.com/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      MyQuran API (Jadwal Sholat)
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="mb-4 font-semibold text-slate-900">
                  Community Repos
                </h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li>
                    <a
                      href="https://github.com/Otangid/muslim-api"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Dataset keislaman
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/nasrul21/data-pesantren-indonesia"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Data Pesantren
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/kresnasatya/api-harilibur"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Libur Nasional
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/gadingnst/hadith-api"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Koleksi Hadith
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="mb-4 font-semibold text-slate-900">Inspiration</h4>
                <p class="text-sm leading-relaxed text-slate-500">
                  Original template by{" "}
                  <a
                    href="http://www.designstub.com/"
                    target="_blank"
                    class="hover:text-emerald-600"
                  >
                    Designstub
                  </a>
                </p>
              </div>
              <div>
                <h4 class="mb-4 font-semibold text-slate-900">Support Project</h4>
                <div
                  onclick="window.openDonationModal()"
                  class="flex gap-3 items-center p-3 mb-3 w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm transition-all cursor-pointer group hover:border-emerald-300 hover:shadow-md"
                >
                  <div class="flex justify-center items-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-lg transition-transform shadow-emerald-200 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="text-[10px] text-emerald-600 font-medium">
                      Donasi via QRIS
                    </div>
                    <div class="text-xs font-bold text-slate-900">
                      Support Developer
                    </div>
                  </div>
                </div>
                {/* <a
                  href="https://github.com/vrush2000/muslim-all-in-one-api"
                  target="_blank"
                  class="flex gap-3 items-center p-3 w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm transition-all cursor-pointer group hover:border-emerald-300 hover:shadow-md"
                >
                  <div class="flex justify-center items-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-lg transition-transform shadow-emerald-200 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="text-[10px] text-emerald-600 font-medium">
                      Star on GitHub
                    </div>
                  </div>
                </a> */}
              </div>
            </div>
            <div class="pt-8 mt-12 text-center border-t border-slate-100">
              <p class="mb-4 text-sm text-slate-500">
                Dikembangkan dengan ❤️ untuk Ummat.
              </p>
              <p class="text-xs text-slate-400">
                © {new Date().getFullYear()} Muslim All-in-One API. Created by
                Vrush Studio.
              </p>
            </div>
          </div>
        </footer>

        {/* Donation Modal */}
        <div
          id="donation-modal"
          class="fixed inset-0 z-[100] hidden overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex justify-center items-center px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0">
            <div
              class="fixed inset-0 backdrop-blur-sm transition-opacity bg-slate-900/60"
              onclick="window.closeDonationModal()"
              style="z-index: -1;"
            ></div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div class="inline-block overflow-hidden relative z-10 text-left align-bottom bg-white rounded-3xl border shadow-2xl transition-all transform sm:my-8 sm:align-middle sm:max-w-md sm:w-full border-slate-100">
              {/* Header */}
              <div class="flex relative z-20 justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div class="flex gap-3 items-center text-white">
                  <div class="p-2 rounded-lg backdrop-blur-md bg-white/20">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold leading-6" id="modal-title">
                    Dukung Muslim API
                  </h3>
                </div>
                <button
                  onclick="window.closeDonationModal()"
                  class="transition-colors text-white/80 hover:text-white"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div class="px-6 py-6">
                <div id="donation-options-section">
                  <p class="mb-6 text-sm text-center text-slate-600">
                    Pilih atau masukkan nominal donasi untuk mendukung pengembangan Muslim API.
                  </p>

                  <div class="grid grid-cols-3 gap-3 mb-6">
                    {[5000, 10000, 20000, 50000, 100000, 250000].map((amount) => (
                      <button
                        onclick={`window.selectPreset(${amount})`}
                        class="relative z-20 px-2 py-3 text-sm font-bold rounded-xl border transition-all preset-btn bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)}
                      </button>
                    ))}
                  </div>

                  <div class="relative z-20 mb-6">
                    <div class="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
                      <span class="font-bold text-slate-400">Rp</span>
                    </div>
                    <input
                      type="number"
                      id="custom-amount"
                      class="block py-4 pr-4 pl-12 w-full text-lg font-bold rounded-2xl border transition-all bg-slate-50 border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Nominal lainnya..."
                    />
                  </div>

                  <button
                    id="generate-qris-btn"
                    onclick="window.generateDonationQR()"
                    class="flex relative z-20 gap-2 justify-center items-center py-4 w-full font-bold text-white rounded-2xl shadow-xl transition-all bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                  >
                    Generate QRIS
                  </button>
                </div>

                <div id="qris-display-section" class="hidden text-center">
                  <div class="mb-4">
                    <div id="display-amount" class="text-2xl font-black text-slate-800">Rp 0</div>
                    <div class="text-xs font-medium text-slate-400">Scan QRIS untuk membayar</div>
                    <div class="text-xs font-medium text-slate-400">dan akan diarahkan ke Hariistimewa.com - DANA</div>
                  </div>

                  <div class="inline-block p-4 mb-6 bg-white rounded-2xl border-2 shadow-sm border-slate-100">
                    <img id="qris-image" src="" alt="QRIS" class="w-64 h-64" />
                  </div>

                  <div class="p-4 mb-6 text-left rounded-xl bg-slate-50">
                    <div class="flex gap-3 items-start">
                      <div class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                      <p class="text-xs text-slate-600">Buka aplikasi pembayaran (Gopay, OVO, Dana, LinkAja, atau Mobile Banking).</p>
                    </div>
                    <div class="flex gap-3 items-start mt-3">
                      <div class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                      <p class="text-xs text-slate-600">Pilih menu <b>Scan/Bayar</b> lalu arahkan kamera ke QR Code di atas.</p>
                    </div>
                    <div class="flex gap-3 items-start mt-3">
                      <div class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                      <p class="text-xs text-slate-600">Pastikan nominal sesuai dan selesaikan pembayaran.</p>
                    </div>
                  </div>

                  <button
                    onclick="window.resetDonationModal()"
                    class="text-sm font-bold text-emerald-600 hover:underline"
                  >
                    Ganti Nominal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          window.openDonationModal = function() {
            document.getElementById('donation-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
          }

          window.closeDonationModal = function() {
            document.getElementById('donation-modal').classList.add('hidden');
            document.body.style.overflow = 'auto';
            window.resetDonationModal();
          }

          window.selectPreset = function(amount) {
            const input = document.getElementById('custom-amount');
            input.value = amount;
            
            // Highlight selected preset
            document.querySelectorAll('.preset-btn').forEach(btn => {
              btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-500/20');
            });
            
            event.currentTarget.classList.add('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-500/20');
          }

          window.generateDonationQR = async function() {
            const amountInput = document.getElementById('custom-amount');
            const amount = parseInt(amountInput.value);
            const btn = document.getElementById('generate-qris-btn');
            
            if (!amount || amount < 1000) {
              alert('Pilh atau masukkan nominal donasi');
              return;
            }

            btn.disabled = true;
            btn.innerHTML = '<svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';

            try {
              const response = await fetch('/api/qris/generate?amount=' + amount);
              const result = await response.json();

              if (result.status === 200) {
                document.getElementById('donation-options-section').classList.add('hidden');
                document.getElementById('qris-display-section').classList.remove('hidden');
                
                document.getElementById('display-amount').innerText = new Intl.NumberFormat(\'id-ID\', { 
                  style: \'currency\', 
                  currency: \'IDR\', 
                  minimumFractionDigits: 0 
                }).format(amount);
                
                document.getElementById(\'qris-image\').src = result.data.qr_image;
              } else {
                alert(\'Gagal generate QRIS: \' + result.message);
              }
            } catch (error) {
              console.error(\'Error:\', error);
              alert(\'Terjadi kesalahan saat generate QRIS\');
            } finally {
              btn.disabled = false;
              btn.innerHTML = \'Generate QRIS\';
            }
          }

          window.resetDonationModal = function() {
            document.getElementById(\'donation-options-section\').classList.remove(\'hidden\');
            document.getElementById(\'qris-display-section\').classList.add(\'hidden\');
            document.getElementById(\'custom-amount\').value = \'\';
            document.querySelectorAll(\'.preset-btn\').forEach(btn => {
              btn.classList.remove(\'border-emerald-500\', \'bg-emerald-50\', \'ring-2\', \'ring-emerald-500/20\');
            });
          }

          // Close on ESC
          document.addEventListener(\'keydown\', function(e) {
            if (e.key === \'Escape\') {
              window.closeDonationModal();
            }
          });
        ` }} />
      </body>
    </html>
  );
};
