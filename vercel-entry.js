import { handle } from '@hono/node-server/vercel';
import app from './src/app.jsx';

// Menggunakan adapter dari @hono/node-server/vercel yang lebih stabil untuk Node.js runtime di Vercel
// Ini memperbaiki error "this.raw.headers.get is not a function"
export default handle(app);
