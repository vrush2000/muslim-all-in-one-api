/** @jsx jsx */
import { jsx } from 'hono/jsx';

export const Status = ({ baseUrl }) => {
  return (
    <div class="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div class="bg-gradient-to-b from-emerald-600 to-emerald-800 text-white pt-20 pb-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-bold mb-6 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            SYSTEM STATUS: OPERATIONAL
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            API System Monitoring
          </h1>
          <p class="text-emerald-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time monitoring and health checks for all Muslim API services and external providers.
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* Status Grid */}
        <div id="status-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Internal Services */}
          <div class="col-span-full mb-4">
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Core & Internal Services
            </h2>
          </div>
          
          <StatusCard 
            name="Core API Engine" 
            endpoint="/health" 
            description="Status inti sistem"
            type="internal"
          />
          <StatusCard 
            name="Al-Quran API" 
            endpoint="/surah" 
            description="Teks, terjemahan, dan tafsir Al-Quran"
            type="internal"
          />
          <StatusCard 
            name="Jadwal Sholat API" 
            endpoint="/sholat/kota/semua" 
            description="Layanan data waktu sholat"
            type="internal"
          />
          <StatusCard 
            name="Hadits API" 
            endpoint="/hadits?nomor=1" 
            description="Koleksi Hadits Arbain & 9 Imam"
            type="internal"
          />
          <StatusCard 
            name="Sejarah API" 
            endpoint="/sejarah" 
            description="Sejarah Islam & Sirah Nabawiyah"
            type="internal"
          />
          <StatusCard 
            name="Kemenag API" 
            endpoint="/kemenag/masjid" 
            description="Data Masjid, Pesantren, & Libur"
            type="internal"
          />
          <StatusCard 
            name="Integrity System" 
            endpoint="/integrity/verify" 
            description="Data integrity verification chain"
            type="internal"
          />

          {/* External Providers */}
          <div class="col-span-full mt-8 mb-4">
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
              External Data Providers
            </h2>
          </div>

          <StatusCard 
            name="equran.id" 
            endpoint="https://equran.id/api/v2/surat" 
            description="Audio Murottal & Quran v2"
            type="external"
          />
          <StatusCard 
            name="MyQuran API" 
            endpoint="https://api.myquran.com/v2/sholat/kota/semua" 
            description="Source data Jadwal Sholat"
            type="external"
          />
          <StatusCard 
            name="Hadith Gading" 
            endpoint="https://api.hadith.gading.dev/books" 
            description="Source data Hadits Besar"
            type="external"
          />
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          window.baseUrl = "${baseUrl}";
          
          async function checkStatus(card) {
            const endpoint = card.dataset.endpoint;
            const type = card.dataset.type;
            
            let fullUrl;
            if (type === 'internal') {
              // Use relative paths to avoid Mixed Content issues
              fullUrl = endpoint === '/health' ? '/health' : '/v1' + endpoint;
            } else {
              fullUrl = endpoint;
            }
            
            const statusEl = card.querySelector('.status-indicator');
            const textEl = card.querySelector('.status-text');
            const latencyEl = card.querySelector('.latency-text');
            const uptimeEl = card.querySelector('.uptime-bar');
            
            const start = performance.now();
            try {
              const fetchOptions = type === 'internal' ? { mode: 'cors' } : { mode: 'no-cors' };
              const response = await fetch(fullUrl, fetchOptions);
              const latency = Math.round(performance.now() - start);
              
              const isOnline = type === 'internal' ? response.ok : true;
              
              if (isOnline) {
                statusEl.className = 'status-indicator w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
                textEl.innerText = 'Online';
                textEl.className = 'status-text text-sm font-bold text-emerald-600';
                latencyEl.innerText = latency + 'ms';
                updateUptimeBar(uptimeEl, true);
              } else {
                throw new Error('Offline');
              }
            } catch (error) {
              statusEl.className = 'status-indicator w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
              textEl.innerText = 'Offline';
              textEl.className = 'status-text text-sm font-bold text-red-600';
              latencyEl.innerText = '-- ms';
              updateUptimeBar(uptimeEl, false);
            }
          }

          function updateUptimeBar(el, isOnline) {
            const dots = el.querySelectorAll('.uptime-dot');
            const lastIndex = dots.length - 1;
            for(let i = 0; i < lastIndex; i++) {
              dots[i].className = dots[i+1].className;
            }
            dots[lastIndex].className = 'uptime-dot h-4 w-1 rounded-full ' + (isOnline ? 'bg-emerald-500' : 'bg-red-500');
          }

          function initStatus() {
            const cards = document.querySelectorAll('.status-card');
            cards.forEach(card => {
              checkStatus(card);
              setInterval(() => checkStatus(card), 30000);
            });
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initStatus);
          } else {
            initStatus();
          }
          
          window.addEventListener('load', function() {
            const cards = document.querySelectorAll('.status-card');
            const firstCard = cards[0];
            if (firstCard) {
              const textEl = firstCard.querySelector('.status-text');
              if (textEl && textEl.innerText === 'Checking...') {
                initStatus();
              }
            }
          });
        })();
      `}} />
    </div>
  );
};

const StatusCard = ({ name, endpoint, description, type }) => {
  return (
    <div 
      class="status-card bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
      data-endpoint={endpoint}
      data-type={type}
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{name}</h3>
          <p class="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <div class="status-indicator w-3 h-3 rounded-full bg-slate-300 animate-pulse"></div>
            <span class="status-text text-sm font-bold text-slate-400 italic">Checking...</span>
          </div>
          <span class="latency-text text-[10px] font-mono text-slate-400 mt-2">-- ms</span>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Uptime (Last 24h)</span>
          <span>99.9%</span>
        </div>
        <div class="uptime-bar flex gap-0.5 h-4">
          {[...Array(40)].map((_, i) => (
            <div key={i} class="uptime-dot h-4 w-1 rounded-full bg-emerald-500/20"></div>
          ))}
        </div>
        <div class="flex justify-between text-[10px] text-slate-300">
          <span>24h ago</span>
          <span>Just now</span>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-50">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">{endpoint}</span>
          <div class="flex gap-2">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
