import { serve } from '@hono/node-server';
import app from '../src/app.jsx';

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
