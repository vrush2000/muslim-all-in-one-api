/** @jsx jsx */
import { jsx } from 'hono/jsx';

export const AyatWidget = ({ data, baseUrl }) => {
  const displayUrl = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'muslim-api.vercel.app';
  const fullUrl = baseUrl || 'https://muslim-api.vercel.app';

  if (!data) return (
    <div class="flex justify-center items-center p-4 h-screen font-medium text-center text-blue-800 bg-blue-50">
      Gagal memuat ayat harian.
    </div>
  );

  return (
    <div class="flex flex-col min-h-screen font-sans bg-white">
      <div class="p-4 text-white bg-blue-600">
        <h2 class="text-lg font-bold">Ayat Harian</h2>
        <p class="text-xs opacity-90">{data.surah_name} : {data.ayah}</p>
      </div>
      <div class="flex flex-col flex-grow justify-center p-4 text-center">
        <p class="mb-2 font-serif text-xl leading-loose text-slate-900" dir="rtl">
          {data.arab}
        </p>
        <p class="text-xs italic leading-relaxed text-slate-600">
          "{data.translation}"
        </p>
      </div>
      <div class="p-2 mt-auto text-center bg-slate-50">
        <a href={fullUrl} target="_blank" class="text-[10px] text-slate-400 hover:text-blue-600 transition-colors">
          {displayUrl}
        </a>
      </div>
    </div>
  );
};
