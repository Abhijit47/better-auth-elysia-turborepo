import { authDB } from '@workspace/db/auth-db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { config } from 'dotenv';

config({ path: '.env.local' });

export const auth = betterAuth({
  database: drizzleAdapter(authDB, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: 'http://localhost:3000', // process.env.BETTER_AUTH_URL,
  basePath: '/api/auth', // ADD THIS LINE
  secret: 'JMv8W1NsZV96zQiXFCziHv4CMhOU5qXN', // process.env.BETTER_AUTH_SECRET,
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
  ],
  plugins: [openAPI()],
});

export type Auth = ReturnType<typeof betterAuth>;
// export const Session = Auth['$Infer']['Session'];
