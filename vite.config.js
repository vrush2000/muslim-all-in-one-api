import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';

export default defineConfig({
  plugins: [
    devServer({
      entry: 'api/app.js',
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$|api\/.*\.js$|routes\/.*\.js$|components\/.*\.js$/,
    exclude: [],
  },
  server: {
    port: 3000,
  },
});
