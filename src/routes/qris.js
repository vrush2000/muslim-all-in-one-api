import { Hono } from 'hono';
import { qrisdynamicgenerator } from "@misterdevs/qris-static-to-dynamic";
import qrcode from 'qrcode-generator';

const router = new Hono();

// Ganti dengan QRIS statis Anda (Contoh: Misterdevs)
const STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915314378691502091437869150303UMI51440014ID.CO.QRIS.WWW0215ID10210738442970303UMI5204899953033605802ID5916Hariistimewa.com6015Kota Jakarta Se6105128206304D1F0";

router.get('/generate', async (c) => {
  const amount = parseInt(c.req.query('amount'));
  
  if (!amount || isNaN(amount)) {
    return c.json({ status: 400, message: 'Amount is required and must be a number' }, 400);
  }

  try {
    const qrisDynamic = qrisdynamicgenerator(STATIC_QRIS, amount);
    
    // Menggunakan qrcode-generator karena library 'qrcode' standar memiliki side-effect 
    // mencoba mengimpor 'fs' pada saat inisialisasi di lingkungan Node.js/Vercel.
    const qr = qrcode(0, 'M');
    qr.addData(qrisDynamic);
    qr.make();
    
    // Menghasilkan tag SVG
    const cellSize = 6;
    const margin = 2;
    const svgTag = qr.createSvgTag(cellSize, margin);
    
    // Ekstrak konten SVG dari tag atau gunakan langsung sebagai base64
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
    return c.json({ status: 500, message: error.message }, 500);
  }
});

export default router;
