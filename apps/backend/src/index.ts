import { node } from '@elysiajs/node';
import { openapi } from '@elysiajs/openapi';
import { config } from 'dotenv';
import { Elysia } from 'elysia';

config({ path: '.env.local' });

const app = new Elysia({ adapter: node() });

app.use(
  openapi({
    provider: 'swagger-ui',
    // title: 'Backend API',
    // version: '0.0.1',
    // docsPath: '/api/docs',
  })
);

// Health check endpoint
app.get('/', () => ({
  message: 'Backend is running',
  timestamp: new Date().toISOString(),
}));

// API health status
app.get('/api/health', () => ({
  status: 'healthy',
  version: '0.0.1',
  uptime: process.uptime(),
}));

// Auth route group (placeholder for future use)
app.group('/api/auth', (auth) =>
  auth
    .post('/register', async (ctx) => {
      // Registration endpoint will be implemented later
      return { message: 'Registration endpoint' };
    })
    .post('/login', async (ctx) => {
      // Login endpoint will be implemented later
      return { message: 'Login endpoint' };
    })
    .post('/logout', async (ctx) => {
      // Logout endpoint will be implemented later
      return { message: 'Logout endpoint' };
    })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`🚀 Backend running at http://localhost:${port}`);
});

export default app;
