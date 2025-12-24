import { handle } from 'hono/vercel';
import app from '../src/app.jsx';

export default handle(app);
