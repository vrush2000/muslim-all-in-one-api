/** @jsx jsx */
import { jsx } from 'hono/jsx'

export const Playground = ({ baseUrl }) => {
  return (
    <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="mb-12">
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight text-slate-900">API Playground</h1>
        <p class="text-lg text-slate-600">
          Uji coba API secara interaktif. Pilih endpoint, masukkan parameter, dan lihat hasilnya secara langsung.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Request Panel */}
        <div class="space-y-6">
          <div class="p-8 bg-white rounded-3xl border shadow-sm border-slate-200">
            <h3 class="flex gap-2 items-center mb-6 text-xl font-bold text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Konfigurasi Request
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block mb-2 text-sm font-semibold text-slate-700">Pilih Kategori</label>
                <select 
                  id="category-select"
                  class="px-4 py-3 w-full rounded-xl border transition-all cursor-pointer bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  onchange="window.updateEndpoints(this.value)"
                >
                  <option value="quran">Al-Quran Indonesia</option>
                  <option value="sholat">Jadwal Sholat</option>
                  <option value="hadits">Hadits</option>
                  <option value="murottal">Murottal Audio</option>
                  <option value="kemenag">Kemenag Open Data</option>
                  <option value="sejarah">Sejarah Islam</option>
                  <option value="puasa">Puasa & Fiqh</option>
                  <option value="tools">Tools & Fitur Cerdas</option>
                  <option value="integrity">Integrity Chain</option>
                  <option value="analytics">Spiritual Analytics</option>
                  <option value="other">Lainnya (Asmaul Husna, Doa, dll)</option>
                </select>
              </div>

              <div>
                <label class="block mb-2 text-sm font-semibold text-slate-700">Endpoint</label>
                <select 
                  id="endpoint-select"
                  class="px-4 py-3 w-full font-mono text-sm rounded-xl border transition-all cursor-pointer bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  onchange="window.updateParams(this.value)"
                >
                  {/* Options populated by JS */}
                </select>
              </div>

              <div id="params-container" class="hidden pt-4 space-y-4 border-t border-slate-100">
                <label class="block text-sm font-semibold text-slate-700">Parameter</label>
                <div id="params-fields" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Fields populated by JS */}
                </div>
              </div>

              <div class="pt-6">
                <button 
                  id="send-request"
                  onclick="window.sendRequest()"
                  class="flex gap-2 justify-center items-center py-4 w-full text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-xl transition-all hover:bg-emerald-700 shadow-emerald-200 group"
                >
                  Kirim Request
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 class="flex gap-2 items-center mb-2 font-bold text-emerald-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips
            </h4>
            <p class="text-sm leading-relaxed text-emerald-700">
              Gunakan playground ini untuk memahami struktur response JSON sebelum mengimplementasikannya di aplikasi Anda. Base URL yang digunakan adalah <code class="font-bold">{baseUrl}</code>.
            </p>
          </div>
        </div>

        {/* Response Panel */}
        <div class="flex flex-col h-full lg:max-h-[700px]">
          <div class="flex overflow-hidden flex-col flex-grow h-full rounded-3xl shadow-2xl bg-slate-900">
            <div class="flex justify-between items-center px-6 py-4 border-b bg-slate-800 border-slate-700 shrink-0">
              <div class="flex gap-3 items-center">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span class="ml-2 text-xs font-bold tracking-widest uppercase text-slate-400">JSON Response</span>
              </div>
              <div id="status-badge" class="hidden">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  200 OK
                </span>
              </div>
            </div>
            <div class="flex overflow-hidden relative flex-col flex-grow custom-scrollbar">
              <div id="loader" class="flex hidden absolute inset-0 z-10 justify-center items-center backdrop-blur-sm bg-slate-900/80">
                <div class="flex flex-col gap-4 items-center">
                  <div class="w-10 h-10 rounded-full border-4 animate-spin border-emerald-500/20 border-t-emerald-500"></div>
                  <span class="font-medium text-emerald-500 animate-pulse">Memuat data...</span>
                </div>
              </div>
              <div id="json-viewer-container" class="flex-grow w-full h-full"></div>
            </div>
            <div class="px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0">
              <span id="response-time">Time: 0ms</span>
              <span id="response-size">Size: 0B</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        /* JSONEditor Custom Style */
        .jsoneditor {
          border: none !important;
        }
        .jsoneditor-menu {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }
        .jsoneditor-navigation-bar {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }
        .jsoneditor-outer {
          background-color: #0f172a !important;
        }
        .jsoneditor-tree {
          background-color: #0f172a !important;
        }
        .jsoneditor-separator {
          background-color: transparent !important;
        }
        .jsoneditor-values {
          color: #10b981 !important;
        }
        .jsoneditor-readonly {
          color: #94a3b8 !important;
        }
        .jsoneditor-string {
          color: #10b981 !important;
        }
        .jsoneditor-number {
          color: #3b82f6 !important;
        }
        .jsoneditor-boolean {
          color: #f59e0b !important;
        }
        .jsoneditor-null {
          color: #ef4444 !important;
        }
        .jsoneditor-field {
          color: #e2e8f0 !important;
        }
        div.jsoneditor-tree-inner {
          padding-bottom: 50px !important;
        }
      ` }} />

      <script dangerouslySetInnerHTML={{ __html: `
        let editor = null;
        
        // Initialize JSONEditor
        const container = document.getElementById('json-viewer-container');
        const options = {
          mode: 'view',
          mainMenuBar: false,
          navigationBar: false,
          statusBar: false,
          onEditable: function (node) {
            return false;
          }
        };
        
        if (typeof JSONEditor !== 'undefined') {
          editor = new JSONEditor(container, options);
          editor.set({ message: "Response akan muncul di sini..." });
          editor.expandAll();
        }

        const endpoints = {
          quran: [
            { id: 'list-surah', path: '/surah', name: 'Daftar Surah', params: [] },
            { id: 'detail-surah', path: '/surah', name: 'Detail Surah', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'Contoh: 1 (Al-Fatihah), 114 (An-Nas)' }] },
            { id: 'tafsir', path: '/tafsir', name: 'Tafsir Kemenag', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }] },
            { id: 'ayah-surah', path: '/ayah/surah', name: 'Ayat by Surah', params: [{ name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }] },
            { id: 'ayah-specific', path: '/ayah/specific', name: 'Spesifik Ayat', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1', hint: 'ID Surah' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1', hint: 'Nomor Ayat' }] },
            { id: 'ayah-juz', path: '/ayah/juz', name: 'Ayat by Juz', params: [{ name: 'juzId', placeholder: '1-30', type: 'number', default: '30', hint: 'Nomor Juz (1-30)' }] },
            { id: 'ayah-page', path: '/ayah/page', name: 'Ayat by Halaman', params: [{ name: 'page', placeholder: '1-604', type: 'number', default: '604', hint: 'Halaman Al-Quran (1-604)' }] },
            { id: 'ayah-range', path: '/ayah/range', name: 'Range Ayat', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'start', placeholder: '1', type: 'number', default: '1' }, { name: 'end', placeholder: '7', type: 'number', default: '7' }] },
            { id: 'ayah-find', path: '/ayah/find', name: 'Cari Ayat (Query)', params: [{ name: 'query', placeholder: 'puasa', type: 'text', default: 'puasa', hint: 'Kata kunci pencarian' }] },
            { id: 'juz-list', path: '/juz', name: 'Daftar Juz', params: [] },
            { id: 'juz-detail', path: '/juz', name: 'Detail Juz', params: [{ name: 'juzId', placeholder: '1-30', type: 'number', default: '30', hint: 'Nomor Juz (1-30)' }] },
            { id: 'theme-list', path: '/theme', name: 'Daftar Tema', params: [] },
            { id: 'theme-detail', path: '/theme', name: 'Detail Tema', params: [{ name: 'themeId', placeholder: '1', type: 'number', default: '1', hint: 'ID Tema' }] },
            { id: 'word-ayah', path: '/word', name: 'Kata per Kata', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1' }] },
          ],
          sholat: [
            { id: 'sholat-semua-kota', path: '/sholat/kota/semua', name: 'Semua Kota', params: [] },
            { id: 'sholat-cari-kota', path: '/sholat/kota/cari', name: 'Cari Kota', params: [{ name: 'nama', placeholder: 'jakarta', type: 'text', default: 'jakarta', hint: 'Nama kota yang dicari' }] },
            { id: 'sholat-jadwal-kota', path: '/sholat/jadwal', name: 'Jadwal by Kota ID', params: [
              { 
                name: 'kotaId', 
                type: 'select', 
                default: '1301', 
                options: [
                  { value: '1301', label: '1301 - KOTA JAKARTA' },
                  { value: '1206', label: '1206 - KOTA BANDUNG' },
                  { value: '1638', label: '1638 - KOTA SURABAYA' },
                  { value: '1210', label: '1210 - KOTA BOGOR' },
                  { value: '1505', label: '1505 - KOTA SEMARANG' },
                  { value: '1412', label: '1412 - KOTA YOGYAKARTA' },
                  { value: '1433', label: '1433 - KOTA SURAKARTA (SOLO)' },
                  { value: '1107', label: '1107 - KOTA MALANG' },
                  { value: '0228', label: '0228 - KOTA MEDAN' },
                  { value: '2218', label: '2218 - KOTA MAKASSAR' },
                  { value: '1810', label: '1810 - KOTA BANJARMASIN' },
                  { value: '0412', label: '0412 - KOTA PEKANBARU' },
                  { value: '0816', label: '0816 - KOTA PALEMBANG' },
                  { value: '1708', label: '1708 - KOTA DENPASAR' },
                  { value: '1214', label: '1214 - KOTA BEKASI' },
                  { value: '1211', label: '1211 - KOTA DEPOK' },
                  { value: '1217', label: '1217 - KOTA TANGERANG' },
                  { value: '1218', label: '1218 - KOTA TANGERANG SELATAN' },
                ] 
              }, 
              { name: 'tanggal', placeholder: '2025-12-25', type: 'date', default: new Date().toISOString().split('T')[0] }
            ] },
            { id: 'sholat-jadwal-koordinat', path: '/sholat/jadwal/koordinat', name: 'Jadwal by Koordinat', params: [{ name: 'lat', placeholder: '-6.1751', type: 'text', default: '-6.1751' }, { name: 'lon', placeholder: '106.8272', type: 'text', default: '106.8272' }] },
            { id: 'sholat-next', path: '/sholat/next', name: 'Waktu Sholat Terdekat', params: [{ name: 'lat', placeholder: '-6.1751', type: 'text', default: '-6.1751' }, { name: 'lon', placeholder: '106.8272', type: 'text', default: '106.8272' }] },
          ],
          hadits: [
            { id: 'hadits-list', path: '/hadits', name: 'Daftar Hadits Arbain', params: [] },
            { id: 'hadits-detail', path: '/hadits', name: 'Detail Hadits Arbain', params: [{ name: 'nomor', placeholder: '1-42', type: 'number', default: '1', hint: 'Nomor Hadits (1-42)' }] },
            { id: 'hadits-books', path: '/hadits/books', name: 'Daftar Kitab Hadits', params: [] },
            { id: 'hadits-by-book', path: '/hadits/books/abu-daud', name: 'Hadits by Kitab', params: [{ name: 'range', placeholder: '1-10', type: 'text', default: '1-10', hint: 'Contoh: 1-10 (Hadits nomor 1 sampai 10)' }] },
            { id: 'hadits-cari', path: '/hadits/find', name: 'Cari Hadits (Query)', params: [{ name: 'query', placeholder: 'puasa', type: 'text', default: 'puasa' }] },
          ],
          murottal: [
            { id: 'murottal-qari', path: '/murotal/qari', name: 'Daftar Qari', params: [] },
            { id: 'murottal-surah', path: '/murotal', name: 'Audio by Surah', params: [
              { name: 'surahId', placeholder: '1-114', type: 'number', default: '1', hint: 'ID Surah (1-114)' }, 
              { 
                name: 'qariId', 
                type: 'select', 
                default: '05', 
                options: [
                  { value: '01', label: '01 - Abdullah Al-Juhany' },
                  { value: '02', label: '02 - Abdul-Muhsin Al-Qasim' },
                  { value: '03', label: '03 - Abdurrahman as-Sudais' },
                  { value: '04', label: '04 - Ibrahim Al-Dossari' },
                  { value: '05', label: '05 - Misyari Rasyid Al-Afasi' },
                  { value: '06', label: '06 - Yasser Al-Dosari' },
                ]
              }
            ] },
          ],
          kemenag: [
            { id: 'kemenag-libur', path: '/kemenag/libur', name: 'Hari Libur Nasional', params: [{ name: 'year', type: 'number', default: '2025', placeholder: '2025' }] },
            { id: 'kemenag-provinsi', path: '/kemenag/provinsi', name: 'Daftar Provinsi (Pesantren)', params: [] },
            { id: 'kemenag-kabupaten', path: '/kemenag/kabupaten', name: 'Daftar Kabupaten (Pesantren)', params: [{ name: 'provinsiId', type: 'number', default: '32', placeholder: '32', hint: 'ID Provinsi (Contoh: 32 untuk Jabar)' }] },
            { id: 'kemenag-pesantren', path: '/kemenag/pesantren', name: 'Daftar Pesantren', params: [{ name: 'kabupatenId', type: 'number', default: '3201', placeholder: '3201', hint: 'ID Kabupaten (Contoh: 3201 untuk Bogor)' }] },
            { id: 'kemenag-masjid', path: '/kemenag/masjid', name: 'Daftar Masjid Utama', params: [] },
            { id: 'kemenag-masjid-nearby', path: '/kemenag/masjid/nearby', name: 'Masjid Terdekat (Geo)', params: [{ name: 'lat', type: 'text', default: '-6.1751' }, { name: 'lng', type: 'text', default: '106.8272' }, { name: 'radius', type: 'number', default: '5', hint: 'Radius dalam KM' }] },
          ],
          sejarah: [
            { id: 'sejarah-list', path: '/sejarah', name: 'Daftar Sirah Nabawiyah', params: [] },
            { id: 'sejarah-today', path: '/sejarah/today', name: 'Peristiwa Hari Ini', params: [] },
            { id: 'sejarah-detail', path: '/sejarah/detail', name: 'Detail Sejarah', params: [{ name: 'id', type: 'number', default: '1', placeholder: '1' }] },
          ],
          puasa: [
            { id: 'puasa-all', path: '/puasa', name: 'Daftar Puasa (Wajib & Sunnah)', params: [] },
            { id: 'puasa-fiqh', path: '/puasa/fiqh', name: 'Fiqh & Adab Puasa (70 Masalah)', params: [] },
            { id: 'puasa-find', path: '/puasa/find', name: 'Cari Puasa', params: [{ name: 'query', type: 'text', default: 'bidh', placeholder: 'bidh' }] },
            { id: 'puasa-type', path: '/puasa/type/mingguan', name: 'Filter by Tipe', params: [
              { name: 'type', type: 'select', default: 'mingguan', options: [
                { value: 'mingguan', label: 'Mingguan' },
                { value: 'bulanan', label: 'Bulanan' },
                { value: 'tahunan', label: 'Tahunan' }
              ]}
            ]},
          ],
          tools: [
            { id: 'tools-quotes', path: '/tools/quotes/daily', name: 'Daily Quotes', params: [] },
            { id: 'tools-zakat', path: '/tools/zakat', name: 'Kalkulator Zakat', params: [
              { name: 'type', type: 'select', default: 'maal', options: [{value:'maal', label:'Zakat Maal'}, {value:'penghasilan', label:'Zakat Penghasilan'}, {value:'fitrah', label:'Zakat Fitrah'}] },
              { name: 'amount', type: 'number', default: '100000000', hint: 'Jumlah harta/pendapatan' },
              { name: 'hargaEmas', type: 'number', default: '1200000', hint: 'Harga emas per gram (opsional)' },
              { name: 'hargaBeras', type: 'number', default: '15000', hint: 'Harga beras per kg (Zakat Fitrah)' },
              { name: 'jumlahOrang', type: 'number', default: '1', hint: 'Jumlah jiwa (Zakat Fitrah)' }
            ]},
            { id: 'tools-faraidh', path: '/tools/faraidh', name: 'Kalkulator Waris (Faraidh)', params: [
              { name: 'totalHarta', type: 'number', default: '120000000', hint: 'Total harta warisan' },
              { name: 'suami', type: 'number', default: '1', hint: 'Jumlah suami (0-1)' },
              { name: 'istri', type: 'number', default: '0', hint: 'Jumlah istri' },
              { name: 'anakLk', type: 'number', default: '1', hint: 'Jumlah anak laki-laki' },
              { name: 'anakPr', type: 'number', default: '1', hint: 'Jumlah anak perempuan' },
              { name: 'ayah', type: 'select', default: 'false', options: [{value:'true', label:'Ada'}, {value:'false', label:'Tidak Ada'}] },
              { name: 'ibu', type: 'select', default: 'false', options: [{value:'true', label:'Ada'}, {value:'false', label:'Tidak Ada'}] }
            ]},
            { id: 'tools-qibla', path: '/tools/qibla', name: 'Arah Kiblat', params: [{ name: 'lat', type: 'text', default: '-6.1751' }, { name: 'lng', type: 'text', default: '106.8272' }] },
            { id: 'tools-search', path: '/tools/semantic-search', name: 'Pencarian Semantik (AI)', params: [{ name: 'query', type: 'text', default: 'sabar', hint: 'Cari di Quran & Hadits' }] },
          ],
          integrity: [
            { id: 'integrity-chain', path: '/integrity/chain', name: 'Integrity Chain', params: [] },
            { id: 'integrity-verify', path: '/integrity/verify/ayah', name: 'Verifikasi Ayah', params: [{ name: 'surahId', placeholder: '1', type: 'number', default: '1' }, { name: 'ayahId', placeholder: '1', type: 'number', default: '1' }] },
          ],
          analytics: [
            { id: 'analytics-global', path: '/analytics', name: 'Global Spiritual Analytics', params: [] },
            { id: 'analytics-khatam', path: '/analytics/khatam', name: 'Lapor Khatam (Post)', params: [], method: 'POST' },
          ],
          other: [
            { id: 'asma-list', path: '/asma', name: 'Semua Asmaul Husna', params: [] },
            { id: 'asma-detail', path: '/asma', name: 'Detail Asmaul Husna', params: [{ name: 'id', placeholder: '1-99', type: 'number', default: '1', hint: 'Nomor 1-99' }] },
            { id: 'doa-list', path: '/doa', name: 'Daftar Doa', params: [] },
            { id: 'doa-detail', path: '/doa', name: 'Detail Doa', params: [{ name: 'id', placeholder: '1-30', type: 'number', default: '1', hint: 'ID Doa (1-30+)' }] },
            { id: 'dzikir', path: '/dzikir', name: 'Dzikir Pagi Petang', params: [] },
            { id: 'asbab-list', path: '/asbab', name: 'Daftar Asbabun Nuzul', params: [] },
            { id: 'asbab-detail', path: '/asbab', name: 'Detail Asbabun Nuzul', params: [{ name: 'id', placeholder: 'ID', type: 'number', default: '1' }] },
            { id: 'calendar-hijri', path: '/calendar/hijri', name: 'Konversi ke Hijriah', params: [{ name: 'date', placeholder: '2025-12-25', type: 'date', default: new Date().toISOString().split('T')[0], hint: 'Format: YYYY-MM-DD' }, { name: 'adj', placeholder: '0', type: 'number', default: '0', hint: 'Koreksi hari (-2 s/d 2)' }] },
            { id: 'calendar-masehi', path: '/calendar/masehi', name: 'Konversi ke Masehi', params: [{ name: 'day', placeholder: '1', type: 'number', default: '1' }, { name: 'month', placeholder: '1', type: 'number', default: '1' }, { name: 'year', placeholder: '1447', type: 'number', default: '1447' }] },
          ]
        };

        let currentCategory = 'quran';
        let currentEndpoint = null;
        let isInitialLoad = true;

        window.updateEndpoints = (category) => {
          currentCategory = category;
          const select = document.getElementById('endpoint-select');
          const data = endpoints[category];
          select.innerHTML = data.map(ep => '<option value="' + ep.id + '">' + ep.name + ' (' + ep.path + ')</option>').join('');
          window.updateParams(data[0].id);
        };

        window.updateParams = (endpointId) => {
          const endpoint = endpoints[currentCategory].find(ep => ep.id === endpointId);
          currentEndpoint = endpoint;
          const container = document.getElementById('params-container');
          const fields = document.getElementById('params-fields');
          
          if (endpoint.params.length > 0) {
            container.classList.remove('hidden');
            fields.innerHTML = endpoint.params.map(param => {
              if (param.type === 'select') {
                const optionsHtml = param.options.map(opt => 
                  '<option value="' + opt.value + '" ' + (opt.value === param.default ? 'selected' : '') + '>' + opt.label + '</option>'
                ).join('');

                return '<div class="space-y-1">' +
                    '<label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + param.name + '</label>' +
                    '<div class="relative">' +
                      '<select name="' + param.name + '" class="px-3 py-2 pr-8 w-full text-sm bg-white rounded-lg border transition-all appearance-none cursor-pointer border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">' +
                        optionsHtml +
                      '</select>' +
                      '<div class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none text-slate-400">' +
                        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                      '</div>' +
                    '</div>' +
                    (param.hint ? '<p class="text-[10px] text-slate-400 italic leading-tight">' + param.hint + '</p>' : '') +
                  '</div>';
              }
              return '<div class="space-y-1">' +
                  '<label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + param.name + '</label>' +
                  '<input type="' + param.type + '" name="' + param.name + '" value="' + (param.default || '') + '" placeholder="' + param.placeholder + '" class="px-3 py-2 w-full text-sm bg-white rounded-lg border transition-all border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />' +
                  (param.hint ? '<p class="text-[10px] text-slate-400 italic leading-tight">' + param.hint + '</p>' : '') +
                '</div>';
            }).join('');
          } else {
            container.classList.add('hidden');
            fields.innerHTML = '';
          }
        };

        window.sendRequest = async () => {
          const loader = document.getElementById('loader');
          const statusBadge = document.getElementById('status-badge');
          const responseTime = document.getElementById('response-time');
          const responseSize = document.getElementById('response-size');
          
          loader.classList.remove('hidden');
          const startTime = performance.now();

          try {
            const inputs = document.querySelectorAll('#params-fields input, #params-fields select');
            let path = currentEndpoint.path;
            const queryParams = new URLSearchParams();

            inputs.forEach(input => {
              if (path.includes(':' + input.name)) {
                path = path.replace(':' + input.name, encodeURIComponent(input.value));
              } else if (input.value) {
                queryParams.append(input.name, input.value);
              }
            });

            const queryString = queryParams.toString();
            const fullUrl = \`\${window.location.origin}/v1\${path}\${queryString ? '?' + queryString : ''}\`;
            
            const fetchOptions = {
              method: currentEndpoint.method || 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            };
            
            const response = await fetch(fullUrl, fetchOptions);
            const data = await response.json();
            const endTime = performance.now();

            if (editor) {
              editor.set(data);
              editor.expandAll();
            }

            // Update stats
            statusBadge.innerHTML = \`\u003Cspan class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \${response.ok ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}"\u003E\${response.status} \${response.statusText}\u003C/span\u003E\`;
            statusBadge.classList.remove('hidden');
            responseTime.textContent = \`Time: \${Math.round(endTime - startTime)}ms\`;
            responseSize.textContent = \`Size: \${(JSON.stringify(data).length / 1024).toFixed(2)}KB\`;

          } catch (error) {
            if (editor) {
              editor.set({ error: error.message });
              editor.expandAll();
            }
          } finally {
            loader.classList.add('hidden');
          }
        };

        // Initialize from URL params if exists
        window.addEventListener('load', () => {
          const urlParams = new URLSearchParams(window.location.search);
          const category = urlParams.get('category') || 'quran';
          const endpointId = urlParams.get('endpoint');

          document.getElementById('category-select').value = category;
          window.updateEndpoints(category);

          if (endpointId) {
            document.getElementById('endpoint-select').value = endpointId;
            window.updateParams(endpointId);
            // Auto send request if directed from other pages
            setTimeout(() => window.sendRequest(), 500);
          }
        });
      ` }} />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.2/jsoneditor.min.js"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.2/jsoneditor.min.css" rel="stylesheet" type="text/css" />
    </div>
  )
}
