import { Hono } from 'hono';

const calendar = new Hono();

// Algoritma konversi Kalender Hijriah (Kuwaiti Algorithm dengan koreksi Kemenag)
// Kemenag biasanya menggunakan kriteria MABIMS (koreksi +/- 1 hari)
const g2h = (date, adjustment = 0) => {
  let tempDate = new Date(date);
  if (adjustment !== 0) {
    tempDate.setDate(tempDate.getDate() + adjustment);
  }
  
  let d = tempDate.getDate();
  let m = tempDate.getMonth() + 1;
  let y = tempDate.getFullYear();

  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;

  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  let month = Math.floor((24 * l) / 709);
  let day = l - Math.floor((709 * month) / 24);
  let year = 30 * n + j - 30;

  const islamicMonths = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
    "Jumada al-ula", "Jumada al-akhira", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];

  const jawaMonths = [
    "Sura", "Sapar", "Mulud", "Bakda Mulud",
    "Jumadil Awal", "Jumadil Akhir", "Rejeb", "Ruwah",
    "Pasa", "Sawal", "Sela", "Besar"
  ];

  const pasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
  const jawaDays = ["Ahad", "Senen", "Slasa", "Rebo", "Kemis", "Jemuah", "Setu"];
  
  // 1 Januari 1970 adalah Kamis Wage (Wage = index 3)
  const baseDate = new Date(1970, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const pasaranIndex = (((diffDays + 3) % 5) + 5) % 5;
  const jawaDayIndex = date.getDay();

  return {
    day,
    month: month,
    month_name: islamicMonths[month - 1],
    year,
    jawa: {
      day,
      month: month,
      month_name: jawaMonths[month - 1],
      year: year + 512,
      pasaran: pasaran[pasaranIndex],
      day_name: jawaDays[jawaDayIndex],
      formatted: `${jawaDays[jawaDayIndex]} ${pasaran[pasaranIndex]}, ${day} ${jawaMonths[month - 1]} ${year + 512}`
    },
    formatted: `${day} ${islamicMonths[month - 1]} ${year} AH`
  };
};

const h2g = (hDay, hMonth, hYear) => {
  let jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  
  let l = jd + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  let d = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  let m = j + 2 - 12 * l;
  let y = 100 * (n - 49) + i + l;

  const date = new Date(y, m - 1, d);
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return {
    day: d,
    day_name: dayNames[date.getDay()],
    month: m,
    month_name: monthNames[m - 1],
    year: y,
    formatted: `${dayNames[date.getDay()]}, ${d} ${monthNames[m - 1]} ${y}`
  };
};

// GET /calendar/hijri?date=2024-03-11&adj=-1
calendar.get('/hijri', (c) => {
  try {
    const dateStr = c.req.query('date');
    const adj = parseInt(c.req.query('adj')) || 0; // Default 0 jika tidak ada adj
    let date;
    
    if (dateStr) {
      date = new Date(dateStr);
    } else {
      date = new Date();
    }

    if (isNaN(date.getTime())) {
      return c.json({ status: 400, message: "Invalid date format. Use YYYY-MM-DD" }, 400);
    }

    const hijri = g2h(date, adj);
    return c.json({
      status: 200,
      data: {
        masehi: date.toISOString().split('T')[0],
        adjustment: adj,
        hijri: hijri
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

// GET /calendar/masehi?day=1&month=9&year=1445
calendar.get('/masehi', (c) => {
  try {
    const day = parseInt(c.req.query('day'));
    const month = parseInt(c.req.query('month'));
    const year = parseInt(c.req.query('year'));

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return c.json({ status: 400, message: "Missing or invalid parameters. Requires day, month, and year" }, 400);
    }

    if (month < 1 || month > 12 || day < 1 || day > 30) {
      return c.json({ status: 400, message: "Invalid Hijri date values" }, 400);
    }

    const masehi = h2g(day, month, year);
    return c.json({
      status: 200,
      data: {
        hijri: {
          day,
          month,
          year
        },
        masehi: masehi
      }
    });
  } catch (error) {
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default calendar;