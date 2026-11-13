import { resolve } from 'node:path';
import { createAdminAccount, createApp } from './app.mjs';

const production = process.env.NODE_ENV === 'production';
const host = process.env.HOST || (production ? '0.0.0.0' : '127.0.0.1');
const allowDemoAdminSetup = !production && ['127.0.0.1', '::1', 'localhost'].includes(host);
const dbPath = process.env.DATABASE_PATH || resolve('data/mobcar.sqlite');
if (process.env.BOOTSTRAP_ADMIN_NAME || process.env.BOOTSTRAP_ADMIN_EMAIL || process.env.BOOTSTRAP_ADMIN_PASSWORD) {
  await createAdminAccount({
    dbPath,
    name: process.env.BOOTSTRAP_ADMIN_NAME,
    email: process.env.BOOTSTRAP_ADMIN_EMAIL,
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  });
}
const { app, db } = await createApp({
  dbPath,
  allowedOrigins: process.env.APP_ORIGIN
    ? [process.env.APP_ORIGIN]
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8443', 'http://127.0.0.1:8443'],
  webRoot: resolve('dist'),
  production,
  allowDemoAdminSetup,
});

if (!db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) {
  console.warn('MobCar has no administrator. Configure BOOTSTRAP_ADMIN_* and run `pnpm bootstrap:admin`.');
}

const port = Number(process.env.API_PORT || (process.env.NODE_ENV === 'production' ? process.env.PORT : null) || 3001);
const server = app.listen(port, host, () => {
  console.log(`MobCar server listening on http://${host}:${port}`);
});
const sessionCleanup = setInterval(() => {
  db.prepare('DELETE FROM auth_sessions WHERE expires_at <= ?').run(Date.now());
}, 60 * 60 * 1000);
sessionCleanup.unref();

const shutdown = () => {
  clearInterval(sessionCleanup);
  server.close(() => {
    db.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
