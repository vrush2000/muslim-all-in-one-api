import { Hono } from 'hono';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { makeString } = require('qris-dinamis');
import QRCode from 'qrcode';

const qris = new Hono();

const STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915314378691502091437869150303UMI51440014ID.CO.QRIS.WWW0215ID10210738442970303UMI5204899953033605802ID5916Hariistimewa.com6015Kota Jakarta Se6105128206304D1F0";

qris.get('/generate', async (c) => {
  const amount = c.req.query('amount');
  
  if (!amount) {
    return c.json({ status: false, message: 'Amount is required' }, 400);
  }

  try {
    // Generate dynamic QRIS string
    const dynamicQris = makeString(STATIC_QRIS, { nominal: amount });
    
    // Generate QR Code as Data URL (Base64)
    const qrDataUrl = await QRCode.toDataURL(dynamicQris, {
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return c.json({
      status: true,
      data: {
        amount: parseInt(amount),
        qris_string: dynamicQris,
        qr_image: qrDataUrl
      }
    });
  } catch (error) {
    return c.json({ status: false, message: error.message }, 500);
  }
});

export default qris;
