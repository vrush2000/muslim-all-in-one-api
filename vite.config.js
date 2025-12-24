import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/app.jsx',
    }),
  ],
  server: {
    port: 3000,
  },
});
