import { Hono } from 'hono';
import asbab from './asbab.js';
import asma from './asma.js';
import ayah from './ayah.js';
import calendar from './calendar.js';
import doa from './doa.js';
import dzikir from './dzikir.js';
import hadits from './hadits.js';
import juz from './juz.js';
import murotal from './murotal.js';
import integrity from './integrity.js';
import sholat from './sholat.js';
import surah from './surah.js';
import tafsir from './tafsir.js';
import theme from './theme.js';
import word from './word.js';
import admin from './admin.js';
import kemenag from './kemenag.js';
import sejarah from './sejarah.js';
import tools from './tools.js';
import analytics from './analytics.js';

const v1 = new Hono();

v1.route('/asbab', asbab);
v1.route('/asma', asma);
v1.route('/ayah', ayah);
v1.route('/calendar', calendar);
v1.route('/doa', doa);
v1.route('/dzikir', dzikir);
v1.route('/hadits', hadits);
v1.route('/juz', juz);
v1.route('/murotal', murotal);
v1.route('/integrity', integrity);
v1.route('/sholat', sholat);
v1.route('/surah', surah);
v1.route('/tafsir', tafsir);
v1.route('/theme', theme);
v1.route('/word', word);
v1.route('/admin', admin);
v1.route('/kemenag', kemenag);
v1.route('/sejarah', sejarah);
v1.route('/tools', tools);
v1.route('/analytics', analytics);

v1.get('/', (c) => {
  return c.json({
    status: true,
    message: "Selamat datang di Muslim API v1. Berikut adalah daftar endpoint yang tersedia.",
    data: {
      quran: {
        surah: {
          daftarSurah: {
            pattern: "/v1/surah",
          },
          infoSurah: {
            pattern: "/v1/surah?surahId={surahId}",
            contoh: "/v1/surah?surahId=114",
          },
        },
        ayah: {
          range: {
            pattern: "/v1/ayah/range?surahId={surahId}&start={start}&end={end}",
            contoh: "/v1/ayah/range?surahId=1&start=1&end=7",
          },
          spesifikSurah: {
            pattern: "/v1/ayah/surah?surahId={surahId}",
            contoh: "/v1/ayah/surah?surahId=1",
          },
          spesifikJuz: {
            pattern: "/v1/ayah/juz?juzId={juzId}",
            contoh: "/v1/ayah/juz?juzId=30",
          },
          spesifikHalaman: {
            pattern: "/v1/ayah/page?page={page}",
            contoh: "/v1/ayah/page?page=604",
          },
          spesifikAyat: {
            pattern: "/v1/ayah/specific?surahId={surahId}&ayahId={ayahId}",
            contoh: "/v1/ayah/specific?surahId=1&ayahId=1",
          },
          cari: {
            pattern: "/v1/ayah/find?query={query}",
            contoh: "/v1/ayah/find?query=puasa",
          },
        },
        juz: {
          semua: {
            pattern: "/v1/juz",
          },
          spesifik: {
            pattern: "/v1/juz?juzId={juzId}",
            contoh: "/v1/juz?juzId=30",
          },
        },
        asbabNujul: {
          semua: {
            pattern: "/v1/asbab",
          },
          spesifik: {
            pattern: "/v1/asbab?id={asbabId}",
            contoh: "/v1/asbab?id=1",
          },
        },
        asmaulHusna: {
          semua: {
            pattern: "/v1/asma",
          },
          spesifik: {
            pattern: "/v1/asma?id={asmaId}",
            contoh: "/v1/asma?id=1",
          },
        },
        murotal: {
          qari: {
            pattern: "/v1/murotal/qari",
          },
          semua: {
            pattern: "/v1/murotal",
          },
          spesifikQari: {
            pattern: "/v1/murotal?qariId={qariId}",
            contoh: "/v1/murotal?qariId=05",
          },
          spesifikSurah: {
            pattern: "/v1/murotal?surahId={surahId}&qariId={qariId}",
            contoh: "/v1/murotal?surahId=1&qariId=05",
          },
        },
        jadwalSholat: {
          semuaKota: {
            pattern: "/v1/sholat/kota/semua",
          },
          cariKota: {
            pattern: "/v1/sholat/kota/cari?nama={namaKota}",
            contoh: "/v1/sholat/kota/cari?nama=jakarta",
          },
          jadwalByKota: {
            pattern: "/v1/sholat/jadwal?kotaId={kotaId}&tanggal={YYYY-MM-DD}",
            contoh: "/v1/sholat/jadwal?kotaId=58a2fc6ed39fd083f55d4182bf88826d&tanggal=2025-12-24",
          },
          jadwalByKoordinat: {
            pattern: "/v1/sholat/jadwal/koordinat?lat={latitude}&lon={longitude}",
            contoh: "/v1/sholat/jadwal/koordinat?lat=-6.1751&lon=106.8272",
          },
          sholatTerdekat: {
            pattern: "/v1/sholat/next?lat={lat}&lon={lon}",
            contoh: "/v1/sholat/next?lat=-6.1751&lon=106.8272",
          },
        },
        calendar: {
          masehiToHijri: {
            pattern: "/v1/calendar/hijri?date={YYYY-MM-DD}",
            contoh: "/v1/calendar/hijri?date=2024-03-11",
          },
          hijriToMasehi: {
            pattern: "/v1/calendar/masehi?day={day}&month={month}&year={year}",
            contoh: "/v1/calendar/masehi?day=1&month=9&year=1445",
          },
        },
        tafsir: {
          semua: {
            pattern: "/v1/tafsir",
          },
          spesifikSurah: {
            pattern: "/v1/tafsir?surahId={surahId}",
            contoh: "/v1/tafsir?surahId=1",
          },
        },
        theme: {
          semua: {
            pattern: "/v1/theme",
          },
          spesifik: {
            pattern: "/v1/theme?themeId={themeId}",
            contoh: "/v1/theme?themeId=1",
          },
        },
        kataPerKata: {
          semua: {
            pattern: "/v1/word",
          },
          spesifikSurah: {
            pattern: "/v1/word?surahId={surahId}",
            contoh: "/v1/word?surahId=1",
          },
          spesifikAyat: {
            pattern: "/v1/word?surahId={surahId}&ayahId={ayahId}",
            contoh: "/v1/word?surahId=1&ayahId=1",
          },
        },
      },
      doa: {
        semua: {
          pattern: "/v1/doa",
        },
        spesifikSumber: {
          pattern: "/v1/doa?source={source}",
          contoh: "/v1/doa?source=quran",
        },
        cari: {
          pattern: "/v1/doa/find?query={query}",
          contoh: "/v1/doa/find?query=makan",
        },
      },
      dzikir: {
        semua: {
          pattern: "/v1/dzikir",
        },
        spesifikTipe: {
          pattern: "/v1/dzikir?type={type}",
          contoh: "/v1/dzikir?type=pagi",
        },
      },
      hadits: {
        semua: {
          pattern: "/v1/hadits",
        },
        spesifikNomor: {
          pattern: "/v1/hadits?nomor={nomor}",
          contoh: "/v1/hadits?nomor=1",
        },
        cari: {
          pattern: "/v1/hadits/find?query={query}",
          contoh: "/v1/hadits/find?query=niat",
        },
      },
      sejarah: {
        semua: {
          pattern: "/v1/sejarah",
        },
        spesifik: {
          pattern: "/v1/sejarah?id={sejarahId}",
          contoh: "/v1/sejarah?id=1",
        },
      },
      kemenag: {
        hariLibur: {
          pattern: "/v1/kemenag/libur?year={year}",
          contoh: "/v1/kemenag/libur?year=2025",
        },
        pesantren: {
          provinsi: {
            pattern: "/v1/kemenag/provinsi",
          },
          kabupaten: {
            pattern: "/v1/kemenag/kabupaten?provinsiId={provinsiId}",
            contoh: "/v1/kemenag/kabupaten?provinsiId=13",
          },
          daftar: {
            pattern: "/v1/kemenag/pesantren?kabupatenId={kabupatenId}",
            contoh: "/v1/kemenag/pesantren?kabupatenId=1301",
          },
        },
        masjid: {
          daftar: {
            pattern: "/v1/kemenag/masjid?search={query}&lokasi={lokasi}",
            contoh: "/v1/kemenag/masjid?search=istiqlal",
          },
          detail: {
            pattern: "/v1/kemenag/masjid/detail?id={id}",
            contoh: "/v1/kemenag/masjid/detail?id=1",
          },
          terdekat: {
            pattern: "/v1/kemenag/masjid/nearby?lat={lat}&lng={lng}&radius={radius}",
            contoh: "/v1/kemenag/masjid/nearby?lat=-6.1702&lng=106.8315",
          },
        },
      },
      tools: {
        quotesHarian: {
          pattern: "/v1/tools/quotes/daily",
        },
        zakat: {
          pattern: "/v1/tools/zakat?type={type}&amount={amount}",
          contoh: "/v1/tools/zakat?type=maal&amount=100000000",
        },
        qibla: {
          pattern: "/v1/tools/qibla?lat={lat}&lng={lng}",
          contoh: "/v1/tools/qibla?lat=-6.1751&lng=106.8272",
        },
        semanticSearch: {
          pattern: "/v1/tools/semantic-search?query={query}",
          contoh: "/v1/tools/semantic-search?query=sabar",
        },
      },
      integrity: {
        chain: {
          pattern: "/v1/integrity/chain",
        },
        verify: {
          pattern: "/v1/integrity/verify",
        },
        verifyAyah: {
          pattern: "/v1/integrity/verify/ayah?surahId={surahId}&ayahId={ayahId}",
          contoh: "/v1/integrity/verify/ayah?surahId=1&ayahId=1",
        },
      },
    }
  });
});
// });

export default v1;
