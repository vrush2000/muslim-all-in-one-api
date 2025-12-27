import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { query as dbQuery } from './database/config.js';

import apiRouter from './routes/index.jsx';
import apiV1Router from './routes/muslim/v1/index.js';
import qrisRouter from './routes/qris.js';

const app = new Hono();

app.use('*', trimTrailingSlash());
app.use('*', logger());
app.use('*', cors());

// Global Health Check
app.get('/health', async (c) => {
  let dbStatus = 'disconnected';
  try {
    const result = await dbQuery('SELECT 1');
    if (result) dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'error: ' + e.message;
  }

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: dbStatus,
      uptime: process.uptime()
    },
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/v1/*', async (c, next) => {
  await next();
  if (c.res.ok && c.req.method === 'GET') {
    c.res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  }
});

const rateLimitMap = new Map();
app.use('/v1/*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'local';
  const userAgent = c.req.header('user-agent') || 'unknown';
  const method = c.req.method;
  const path = c.req.path;

  if (process.env.NODE_ENV === 'production') {
    console.log(`[HIT] ${new Date().toISOString()} | IP: ${ip} | Path: ${path} | UA: ${userAgent}`);
    return await next();
  }

  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > maxRequests) {
    console.warn(`[BLOCKED] ${new Date().toISOString()} | IP: ${ip} | Reason: Rate Limit Exceeded`);
    return c.json({ 
      status: 429, 
      message: 'Anda diblokir sementara karena melakukan terlalu banyak permintaan (spamming). Silakan coba lagi dalam 1 menit.',
      reason: 'Rate limit exceeded',
      client_info: { ip, user_agent: userAgent }
    }, 429);
  }

  console.log(`[HIT] ${new Date().toISOString()} | IP: ${ip} | Method: ${method} | Path: ${path}`);
  await next();
});

app.route('/v1', apiV1Router);
app.route('/api/qris', qrisRouter);
app.route('/', apiRouter);

app.notFound((c) => {
  return c.json({ status: 404, message: 'Not Found' }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ status: 500, message: err.message }, 500);
});

export default app;
