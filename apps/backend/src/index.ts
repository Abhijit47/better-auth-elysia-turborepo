import { cors } from '@elysiajs/cors';
import { node } from '@elysiajs/node';
import { openapi } from '@elysiajs/openapi';
import { auth } from '@workspace/auth/server';
import { config } from 'dotenv';
import { Elysia } from 'elysia';
import { OpenAPI } from './utils.js';

config({ path: '.env.local' });

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

// user middleware (compute user and session and pass to routes)
const betterAuth = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return status(401, 'Unauthorized');
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

const profile = new Elysia()
  .use(betterAuth)
  .onBeforeHandle(({ cookie, status }) => {
    if (!cookie) {
      throw status(401, 'Unauthorized');
    }
  })
  .trace(async ({ onHandle }) => {
    onHandle(({ begin, onStop }) => {
      onStop(({ end }) => {
        console.log('handle took', end - begin, 'ms');
      });
    });
  })
  .get('/profile', ({ user }) => 'Hi there!', { auth: true });

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

app
  .trace(async ({ onHandle }) => {
    onHandle(({ begin, onStop }) => {
      onStop(({ end }) => {
        console.log('handle took', end - begin, 'ms');
      });
    });
  })
  .get(
    '/users',
    ({ user, session, cookie }) => {
      return {
        message: `Hello, ${user.email}! Your session ID is ${session.id}.`,
        cookie,
      };
    },
    { auth: true }
  );

// app.get(
//   '/profile',
//   ({ user }) => {
//     return { message: `This is your profile, ${user.email}.` };
//   },
//   { auth: true }
// );

app.mount(profile);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`🚀 Backend running at http://localhost:${port}`);
});

export default app;
