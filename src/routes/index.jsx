/** @jsx jsx */
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import { Layout } from '../components/Layout.jsx';
import { Home } from '../components/Home.jsx';
import { Other } from '../components/Other.jsx';

const router = new Hono();

router.get("/", (c) => {
  const url = new URL(c.req.url);
  const baseUrl = `${url.protocol}//${url.host}/v1`;
  
  return c.html(
    <Layout title="Muslim All-in-One API | Documentation">
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

export default router;
