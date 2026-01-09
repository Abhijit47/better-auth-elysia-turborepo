import { auth } from '@workspace/auth/server';
import { Elysia } from 'elysia';

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

export default betterAuth;
