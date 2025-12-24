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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV === "development" && (
          <script type="module" src="/@vite/client"></script>
        )}
        <style>{`
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
        `}</style>
      </head>
      <body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Search />
        <header class="sticky top-0 z-50 glass border-b border-slate-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
              <a href="/" class="flex items-center gap-2 group transition-all">
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
                  Muslim All-in-One API
                </span>
              </a>
              <div class="flex items-center">
                {/* Real Search Input */}
                <div class="relative group w-40 md:w-64 mr-4">
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

                <nav class="hidden md:flex space-x-8">
                  <a
                    href="/"
                    class="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Documentation
                  </a>
                  <a
                    href="/other"
                    class="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Other APIs
                  </a>
                </nav>
              </div>
              <div class="md:hidden">
                <button
                  type="button"
                  class="text-slate-600 hover:text-emerald-600"
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
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
              </div>
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
                  <span class="text-lg font-bold">Muslim All-in-One API</span>
                </div>
                <p class="text-slate-500 text-sm leading-relaxed">
                  Penyedia layanan API Muslim gratis untuk mempermudah
                  pengembang dalam membangun aplikasi islami.
                </p>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">Developed By</h4>
                <p class="text-slate-500 text-sm leading-relaxed">
                  Vrush Studio
                  <br />
                  Indonesia
                </p>
              </div>
              <div>
                <h4 class="font-semibold text-slate-900 mb-4">Resources</h4>
                <div class="space-y-2 text-sm text-slate-500">
                  <p>
                    <a
                      href="https://github.com/vrush2000/muslim-all-in-one-api"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      GitHub Repository
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://quran.kemenag.go.id/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Quran Kemenag
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://api.myquran.com/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      MyQuran (Prayer Times)
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://equran.id/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      equran.id (Audio)
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://muslim-api-three.vercel.app/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Muslim API (Dataset)
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://api.hadith.gading.dev/"
                      target="_blank"
                      class="hover:text-emerald-600"
                    >
                      Hadith Gading (Hadith Collection)
                    </a>
                  </p>
                </div>
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
