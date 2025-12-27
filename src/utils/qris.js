/**
 * Utilitas untuk manipulasi string QRIS (Static to Dynamic)
 * Tanpa dependensi eksternal yang menggunakan 'fs' atau 'path'.
 */

export function generateCRC16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function createDynamicQRIS(staticQris, amount) {
  if (!staticQris) throw new Error("QRIS statis diperlukan");
  
  // Hapus CRC16 lama (4 karakter terakhir + tag 63)
  let baseQris = staticQris.slice(0, -4);
  if (baseQris.endsWith("6304")) {
    baseQris = baseQris.slice(0, -4);
  }

  // Helper untuk parsing TLV sederhana
  const parts = [];
  let pos = 0;
  while (pos < baseQris.length) {
    const tag = baseQris.substring(pos, pos + 2);
    const len = parseInt(baseQris.substring(pos + 2, pos + 4));
    const val = baseQris.substring(pos + 4, pos + 4 + len);
    parts.push({ tag, len, val });
    pos += 4 + len;
  }

  // Update tag 01 ke 12 (Dynamic)
  const tag01 = parts.find(p => p.tag === "01");
  if (tag01) {
    tag01.val = "12";
    tag01.len = 2;
  }

  // Tambah/Update tag 54 (Amount)
  const amountStr = amount.toString();
  const tag54 = parts.find(p => p.tag === "54");
  if (tag54) {
    tag54.val = amountStr;
    tag54.len = amountStr.length;
  } else {
    // Masukkan tag 54 sebelum tag 58 atau di posisi yang sesuai
    const index58 = parts.findIndex(p => parseInt(p.tag) > 54);
    const newTag = { tag: "54", len: amountStr.length, val: amountStr };
    if (index58 !== -1) {
      parts.splice(index58, 0, newTag);
    } else {
      parts.push(newTag);
    }
  }

  // Susun kembali string QRIS
  let dynamicQris = parts
    .sort((a, b) => a.tag.localeCompare(b.tag))
    .map(p => p.tag + p.len.toString().padStart(2, "0") + p.val)
    .join("");

  // Tambahkan tag 6304 untuk CRC
  dynamicQris += "6304";
  
  // Hitung CRC16 baru
  const crc = generateCRC16(dynamicQris);
  
  return dynamicQris + crc;
}
