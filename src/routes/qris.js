import { Hono } from 'hono';
import { createDynamicQRIS } from '../utils/qris.js';
import qrcode from 'qrcode-generator';

const router = new Hono();

const STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915314378691502091437869150303UMI51440014ID.CO.QRIS.WWW0215ID10210738442970303UMI5204899953033605802ID5916Hariistimewa.com6015Kota Jakarta Se6105128206304D1F0";

router.get('/generate', async (c) => {
  const amount = parseInt(c.req.query('amount'));
  
  if (!amount || isNaN(amount)) {
    return c.json({ status: 400, message: 'Amount is required and must be a number' }, 400);
  }

  try {
    // Menggunakan utilitas lokal yang bebas dari dependensi 'fs'
    const qrisDynamic = createDynamicQRIS(STATIC_QRIS, amount);
    
    // Menggunakan qrcode-generator yang aman untuk serverless/edge
    const qr = qrcode(0, 'M');
    qr.addData(qrisDynamic);
    qr.make();
    
    const svgTag = qr.createSvgTag(6, 2);
    const qrImage = `data:image/svg+xml;base64,${Buffer.from(svgTag).toString('base64')}`;

    return c.json({
      status: 200,
      data: {
        amount,
        qris_string: qrisDynamic,
        qr_image: qrImage
      }
    });
  } catch (error) {
    console.error('QRIS Error:', error);
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default router;
