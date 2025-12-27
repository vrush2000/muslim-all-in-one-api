import { defineConfig, loadEnv } from 'vite';
import devServer from '@hono/vite-dev-server';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      tailwindcss(),
      devServer({
        entry: 'src/app.jsx',
      }),
    ],
    server: {
      port: 3000,
    },
    define: {
      'process.env.TURSO_DATABASE_URL': JSON.stringify(env.TURSO_DATABASE_URL),
      'process.env.TURSO_AUTH_TOKEN': JSON.stringify(env.TURSO_AUTH_TOKEN),
    },
  };
});
