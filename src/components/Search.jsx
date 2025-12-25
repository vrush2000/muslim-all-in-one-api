/** @jsx jsx */
import { jsx } from 'hono/jsx'

export const Search = () => {
  return (
    <div>
      <script dangerouslySetInnerHTML={{ __html: `
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
      ` }} />
    </div>
  )
}
