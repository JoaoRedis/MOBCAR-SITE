import { resolve } from 'node:path';
import { createAdminAccount } from './app.mjs';

await createAdminAccount({
  dbPath: process.env.DATABASE_PATH || resolve('data/mobcar.sqlite'),
  name: process.env.BOOTSTRAP_ADMIN_NAME,
  email: process.env.BOOTSTRAP_ADMIN_EMAIL,
  password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
});

console.log('Administrator bootstrap completed.');
