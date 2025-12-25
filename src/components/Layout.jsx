/** @jsx jsx */
import { jsx } from "hono/jsx";
import { Search } from "./Search.jsx";

export const Layout = ({ children, title }) => {
  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23059669%22/><path d=%22M30 35v40c10-5 20-5 20 0V35c0-5-10-5-20 0zM70 35v40c-10-5-20-5-20 0V35c0-5 10-5 20 0z%22 fill=%22white%22/></svg>" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.css" />
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
        `}</style>
      </head>
      <body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Search />
        <header class="sticky top-0 z-50 glass border-b border-slate-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
              <a href="/" class="flex items-center gap-2 group transition-all shrink-0">
                <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-white"
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
                <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-500 transition-all">
                  Muslim API
                </span>
              </a>
              <div class="flex items-center gap-1 md:gap-4 lg:gap-4">
                {/* Real Search Input */}
                <div class="relative group w-40 md:w-64">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="search-input-header"
                    oninput="window.handleSearch(this.value)"
                    onfocus="window.handleSearch(this.value)"
                    autocomplete="off"
                    placeholder="Search..."
                    class="block w-full pl-10 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  
                  {/* Results Dropdown */}
                  <div id="search-results-dropdown" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
                    <div id="search-results-content" class="p-2">
                      <div class="text-center py-4 text-slate-400 text-xs">Type to search...</div>
                    </div>
                  </div>
                </div>

                <nav class="hidden md:flex items-center space-x-8">
                  <a
                    href="/"
                    class="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Home
                  </a>
                  
                  {/* Resources Dropdown */}
                  <div class="relative group">
                    <button class="flex items-center gap-1 text-slate-600 group-hover:text-emerald-600 font-medium transition-colors py-4">
                      Resources
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div class="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 z-[100]">
                      <div class="grid grid-cols-3 gap-8">
                        <div>
                          <h5 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Internal Services</h5>
                          <ul class="space-y-3">
                            <li>
                              <a href="/docs" class="group/item flex items-start gap-3">
                                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">Al-Quran API</div>
                                  <div class="text-xs text-slate-500">Teks & Tafsir Kemenag</div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="/other" class="group/item flex items-start gap-3">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">Jadwal Sholat</div>
                                  <div class="text-xs text-slate-500">Seluruh Indonesia</div>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="/status" class="group/item flex items-start gap-3">
                                <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                </div>
                                <div>
                                  <div class="text-sm font-bold text-slate-900">System Status</div>
                                  <div class="text-xs text-slate-500">Uptime & Latency</div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Official Sources</h5>
                          <ul class="space-y-3 text-sm">
                            <li><a href="https://quran.kemenag.go.id/" target="_blank" class="text-slate-600 hover:text-emerald-600 flex items-center gap-2">Quran Kemenag <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></li>
                            <li><a href="https://fatwatarjih.or.id/" target="_blank" class="text-slate-600 hover:text-emerald-600 flex items-center gap-2">Fatwa Tarjih <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></li>
                          </ul>
                        </div>

                        <div>
                          <h5 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Community</h5>
                          <ul class="space-y-3 text-sm">
                            <li><a href="https://github.com/vrush2000/muslim-all-in-one-api" target="_blank" class="text-slate-600 hover:text-emerald-600">GitHub Repo</a></li>
                            <li><a href="https://equran.id/" target="_blank" class="text-slate-600 hover:text-emerald-600">equran.id</a></li>
                            <li><a href="https://api.hadith.gading.dev/" target="_blank" class="text-slate-600 hover:text-emerald-600">Hadith Gading</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href="/playground"
                    class="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-all shadow-sm hover:shadow-emerald-200"
                  >
                    Playground
                  </a>
                </nav>

                <div class="md:hidden">
                  <button
                    type="button"
                    onclick="document.getElementById('mobile-menu').classList.toggle('open')"
                    class="text-slate-600 hover:text-emerald-600 p-2 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
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
            <div id="mobile-menu" class="md:hidden border-t border-slate-100">
              <nav class="flex flex-col space-y-1 px-2 pb-4">
                <a href="/" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all">Home</a>
                
                <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Internal Services</div>
                <a href="/docs" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Al-Quran API
                </a>
                <a href="/other" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Other APIs
                </a>
                <a href="/status" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div> System Status
                </a>

                <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">External Resources</div>
                <a href="https://quran.kemenag.go.id/" target="_blank" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all">Quran Kemenag</a>
                <a href="https://fatwatarjih.or.id/" target="_blank" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all">Fatwa Tarjih</a>
                <a href="https://github.com/vrush2000/muslim-all-in-one-api" target="_blank" class="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-medium transition-all">GitHub Repository</a>
                
                <a href="/playground" class="mt-4 text-center text-white bg-emerald-600 px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100">
                  Open Playground
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main class="flex-grow">{children}</main>

        <footer class="bg-white border-t border-slate-200 py-12 mt-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div class="col-span-1 md:col-span-1">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-white"
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
                <p class="text-slate-500 text-sm leading-relaxed mb-4">
                  Penyedia layanan API Muslim gratis untuk mempermudah
                  pengembang dalam membangun aplikasi islami.
                </p>
                <div class="flex items-center gap-3">
                  <a href="https://github.com/vrush2000/muslim-all-in-one-api" target="_blank" class="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-all" title="GitHub Repository">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="/status" class="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-all" title="System Status">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">API Documentation</h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li><a href="/docs" class="hover:text-emerald-600">Al-Quran API</a></li>
                  <li><a href="/other" class="hover:text-emerald-600">Hadits & Doa</a></li>
                  <li><a href="/other" class="hover:text-emerald-600">Jadwal Sholat</a></li>
                  <li><a href="/other" class="hover:text-emerald-600">Kemenag Data</a></li>
                  <li><a href="/playground" class="text-emerald-600 font-semibold hover:underline">API Playground</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">Official Sources</h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li><a href="https://quran.kemenag.go.id/" target="_blank" class="hover:text-emerald-600 flex items-center gap-1">Quran Kemenag <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></li>
                  <li><a href="https://fatwatarjih.or.id/" target="_blank" class="hover:text-emerald-600 flex items-center gap-1">Fatwa Tarjih <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></li>
                  <li><a href="https://api.myquran.com/" target="_blank" class="hover:text-emerald-600">MyQuran API</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">Community Repos</h4>
                <ul class="space-y-2 text-sm text-slate-500">
                  <li><a href="https://github.com/nasrul21/data-pesantren-indonesia" target="_blank" class="hover:text-emerald-600">Data Pesantren</a></li>
                  <li><a href="https://github.com/kresnasatya/api-harilibur" target="_blank" class="hover:text-emerald-600">Libur Nasional</a></li>
                  <li><a href="https://equran.id/" target="_blank" class="hover:text-emerald-600">equran.id (Audio)</a></li>
                  <li><a href="https://api.hadith.gading.dev/" target="_blank" class="hover:text-emerald-600">Hadith Gading</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">Inspiration</h4>
                <p class="text-slate-500 text-sm leading-relaxed">
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
            </div>
            <div class="border-t border-slate-100 mt-12 pt-8 text-center">
              <p class="text-slate-500 text-sm mb-4">
                Dikembangkan dengan ❤️ untuk Ummat.
              </p>
              <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-400 mb-6">
                <span class="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 9.472c-2.28 0-4.47-.636-6.342-1.742L12 12l6.342 7.73A11.955 11.955 0 0112 21.472z"
                    />
                  </svg>
                  Verified Source
                </span>
                <span class="hidden sm:inline">|</span>
                <span>Sumber Data:</span>
                <a
                  href="https://muslim-api-three.vercel.app"
                  target="_blank"
                  class="hover:text-emerald-600 transition-colors"
                >
                  muslim-api-three (Dataset)
                </a>
                <span class="hidden sm:inline">•</span>
                <a
                  href="https://equran.id"
                  target="_blank"
                  class="hover:text-emerald-600 transition-colors"
                >
                  equran.id (Audio CDN & API v2)
                </a>
                <span class="hidden sm:inline">•</span>
                <a
                  href="https://quran.kemenag.go.id/"
                  target="_blank"
                  class="hover:text-emerald-600 transition-colors"
                >
                  Kemenag RI
                </a>
                <span class="hidden sm:inline">•</span>
                <a
                  href="https://api.hadith.gading.dev/"
                  target="_blank"
                  class="hover:text-emerald-600 transition-colors"
                >
                  Hadith Gading Dev
                </a>
              </div>
              <p class="text-slate-400 text-xs">
                © {new Date().getFullYear()} Muslim All-in-One API. Created by
                Vrush Studio.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};
