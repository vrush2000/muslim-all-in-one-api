import { handle } from 'hono/vercel';
import app from './src/app.jsx';

export default (req, res) => {
  // Polyfill manual untuk headers.get yang sering error di Vercel Node.js runtime
  if (req.headers && typeof req.headers.get !== 'function') {
    req.headers.get = function(name) {
      return this[name.toLowerCase()] || null;
    }.bind(req.headers);
  }

  // Panggil handler hono/vercel yang asli
  const handler = handle(app);
  return handler(req, res);
};
