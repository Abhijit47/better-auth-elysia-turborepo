import { Elysia } from 'elysia';
import betterAuth from '../auth.js';

const users = new Elysia({ prefix: '/v1', name: 'users' })
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
  .group('/users', (app) => {
    return app
      .get(
        '/info',
        ({ user, session, cookie }) => {
          return {
            message: `Hello, ${user.email}! Your session ID is ${session.id}.`,
            cookie,
          };
        },
        { auth: true }
      )
      .get(
        '/profile',
        ({ user }) => {
          return { message: `This is your profile, ${user.email}.` };
        },
        { auth: true }
      );
  });

export default users;
