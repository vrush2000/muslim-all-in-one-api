/** @jsx jsx */
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import { Layout } from '../components/Layout.jsx';
import { Home } from '../components/Home.jsx';
import { Other } from '../components/Other.jsx';
import { Landing } from '../components/Landing.jsx';
import { Playground } from '../components/Playground.jsx';
import { Status } from '../components/Status.jsx';
import { getSejarah } from '../utils/jsonHandler.js';

const router = new Hono();

const getBaseUrl = (c) => {
  const url = new URL(c.req.url);
  const proto = c.req.header('x-forwarded-proto') || url.protocol.split(':')[0];
  return `${proto}://${url.host}/v1`;
};

router.get("/", async (c) => {
  const sejarah = await getSejarah();
  return c.html(
    <Layout title="Muslim All-In-One API | Platform Data Islami Terlengkap">
      <Landing sejarah={sejarah} />
    </Layout>
  );
});

router.get("/docs", (c) => {
  const baseUrl = getBaseUrl(c);
  
  return c.html(
    <Layout title="Muslim API | Documentation">
      <Home baseUrl={baseUrl} />
    </Layout>
  );
});

router.get("/other", (c) => {
  return c.html(
    <Layout title="Muslim All-in-One API | Resources">
      <Other />
    </Layout>
  );
});

router.get("/playground", (c) => {
  const baseUrl = getBaseUrl(c);
  
  return c.html(
    <Layout title="Muslim API | Playground">
      <Playground baseUrl={baseUrl} />
    </Layout>
  );
});

router.get("/status", (c) => {
  const baseUrl = getBaseUrl(c);
  
  return c.html(
    <Layout title="Muslim API | System Status">
      <Status baseUrl={baseUrl} />
    </Layout>
  );
});

export default router;
