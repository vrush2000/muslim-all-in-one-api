/** @jsx jsx */
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import { WidgetLayout } from '../components/widgets/WidgetLayout.jsx';
import { SholatWidget } from '../components/widgets/SholatWidget.jsx';
import { AyatWidget } from '../components/widgets/AyatWidget.jsx';
import { API_CONFIG } from '../config.js';
import { getSurahList, getAyahBySurah } from '../utils/jsonHandler.js';

const widget = new Hono();

// Widget Jadwal Sholat
widget.get('/sholat', async (c) => {
  const cityName = c.req.query('city') || 'jakarta';
  const BASE_API = API_CONFIG.SHOLAT.MYQURAN;
  
  try {
    // 1. Cari ID Kota
    const kotaRes = await fetch(`${BASE_API}/kota/cari/${cityName}`);
    const kotaData = await kotaRes.json();
    
    if (!kotaData.status || !kotaData.data || kotaData.data.length === 0) {
      return c.html(
        <WidgetLayout title="Jadwal Sholat Widget">
          <SholatWidget data={null} city={cityName} />
        </WidgetLayout>
      );
    }
    
    const kota = kotaData.data[0];
    const today = new Date().toISOString().split('T')[0];
    
    // 2. Ambil Jadwal
    const jadwalRes = await fetch(`${BASE_API}/jadwal/${kota.id}/${today}`);
    const jadwalData = await jadwalRes.json();
    
    if (!jadwalData.status || !jadwalData.data || !jadwalData.data.jadwal) {
        throw new Error('Jadwal tidak ditemukan');
    }

    return c.html(
      <WidgetLayout title={`Jadwal Sholat ${kota.lokasi}`}>
        <SholatWidget data={jadwalData.data.jadwal} city={kota.lokasi} baseUrl={new URL(c.req.url).origin} />
      </WidgetLayout>
    );
  } catch (error) {
    return c.html(
      <WidgetLayout title="Jadwal Sholat Widget">
        <SholatWidget data={null} city={cityName} baseUrl={new URL(c.req.url).origin} />
      </WidgetLayout>
    );
  }
});

// Widget Ayat Harian
widget.get('/ayat', async (c) => {
  const baseUrl = new URL(c.req.url).origin;
  try {
    const surahList = await getSurahList();
    const randomSurah = surahList[Math.floor(Math.random() * surahList.length)];
    const ayahs = await getAyahBySurah(randomSurah.number);
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
    
    const data = {
      surah_name: randomSurah.name_id,
      surah_number: randomSurah.number,
      ayah: randomAyah.ayah,
      arab: randomAyah.arab,
      translation: randomAyah.translation_id || randomAyah.text
    };
    
    return c.html(
      <WidgetLayout title="Ayat Harian Widget">
        <AyatWidget data={data} baseUrl={baseUrl} />
      </WidgetLayout>
    );
  } catch (error) {
    console.error('Widget Ayat Error:', error);
    return c.html(
      <WidgetLayout title="Ayat Harian Widget">
        <AyatWidget data={null} baseUrl={baseUrl} />
      </WidgetLayout>
    );
  }
});

export default widget;
