import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';

export default defineConfig({
  plugins: [
    devServer({
      entry: 'api/app.js',
    }),
  ],
  server: {
    port: 3000,
  },
});
