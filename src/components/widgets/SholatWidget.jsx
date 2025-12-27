/** @jsx jsx */
import { jsx } from 'hono/jsx';

export const SholatWidget = ({ data, city, baseUrl }) => {
  const displayUrl = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'muslim-api.vercel.app';
  const fullUrl = baseUrl || 'https://muslim-api.vercel.app';

  if (!data) return (
    <div class="flex justify-center items-center p-4 h-screen font-medium text-center text-emerald-800 bg-emerald-50">
      Gagal memuat jadwal sholat. Pastikan parameter kota benar.
    </div>
  );

  const times = [
    { name: 'Imsak', time: data.imsak },
    { name: 'Subuh', time: data.subuh },
    { name: 'Terbit', time: data.terbit },
    { name: 'Dzuhur', time: data.dzuhur },
    { name: 'Ashar', time: data.ashar },
    { name: 'Maghrib', time: data.maghrib },
    { name: 'Isya', time: data.isya },
  ];

  return (
    <div class="min-h-screen font-sans bg-white">
      <div class="p-4 text-white bg-emerald-600">
        <h2 class="text-lg font-bold">Jadwal Sholat</h2>
        <p class="text-xs opacity-90">{city} - {data.tanggal}</p>
      </div>
      <div class="p-3 space-y-2">
        {times.map((item) => (
          <div key={item.name} class="flex justify-between items-center pb-1.5 border-b border-slate-50 last:border-0">
            <span class="text-sm font-medium text-slate-600">{item.name}</span>
            <span class="text-sm font-bold text-emerald-700">{item.time}</span>
          </div>
        ))}
      </div>
      <div class="p-2 mt-auto text-center bg-slate-50">
        <a href={fullUrl} target="_blank" class="text-[10px] text-slate-400 hover:text-emerald-600 transition-colors">
          {displayUrl}
        </a>
      </div>
    </div>
  );
};
