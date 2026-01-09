import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

// import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
// import { drizzle } from 'drizzle-orm/neon-http';

// let _authDB: NeonHttpDatabase<typeof schema> | null = null;
let _authDB: NodePgDatabase<typeof schema> | null = null;

export const getAuthDB = () => {
  if (_authDB) return _authDB;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('AUTH_DB_CONNECTION_STRING is not defined');
  }

  _authDB = drizzle(connectionString, { schema });
  return _authDB;
};

// export const authDB = new Proxy({} as NeonHttpDatabase<typeof schema>, {
//   get: (_, prop) => getAuthDB()[prop as keyof NeonHttpDatabase<typeof schema>],
// });
export const authDB = new Proxy({} as NodePgDatabase<typeof schema>, {
  get: (_, prop) => getAuthDB()[prop as keyof NodePgDatabase<typeof schema>],
});
