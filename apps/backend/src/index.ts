import { cors } from '@elysiajs/cors';
import { node } from '@elysiajs/node';
import { fromTypes, openapi } from '@elysiajs/openapi';
import { config } from 'dotenv';
import { Elysia } from 'elysia';
import betterAuth from './auth.js';
import users from './users/index.js';
import { OpenAPI } from './utils.js';

config({ path: '.env.local' });

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(betterAuth);

app.use(
  openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
    references: fromTypes(),
  })
);

// Health check endpoint
app.get('/', () => ({
  message: 'Welcome to the Backend API!',
  status: 'healthy',
  version: '0.0.1',
  uptime: process.uptime(),
}));

app.onError(({ error, status }) => {
  console.error('Error occurred:', error);
  return { message: error, status };
});

app.use(users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`🚀 Backend running at http://localhost:${port}`);
});

export default app;
