import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createAdminAccount, createApp } from './app.mjs';

const origin = 'http://localhost:5173';
const adminCredentials = {
  name: 'MobCar Admin',
  email: 'admin@mobcar.test',
  password: 'secure-admin-password-2026',
};
const adminSetupToken = 'mobcar-initial-admin-setup-secret-2026';

async function setup(t, {
  withAdmin = true,
  allowDemoAdminSetup = false,
  setupToken = adminSetupToken,
  production = false,
} = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'mobcar-users-'));
  const dbPath = join(directory, 'users.sqlite');
  const testOrigin = production ? 'https://localhost:5173' : origin;
  if (withAdmin) await createAdminAccount({ dbPath, ...adminCredentials });
  const { app, db } = await createApp({
    dbPath,
    allowedOrigins: [testOrigin],
    webRoot: null,
    production,
    allowDemoAdminSetup,
    initialAdminSetupToken: setupToken,
  });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => {
      db.close();
      rmSync(directory, { recursive: true, force: true });
      if (error) reject(error);
      else resolve();
    });
  }));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const request = (path, { cookie, originHeader = testOrigin, ...options } = {}) => fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(originHeader ? { Origin: originHeader } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });

  const login = async (email, password) => {
    const response = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    assert.equal(response.status, 200);
    return response.headers.get('set-cookie').split(';')[0];
  };

  return { request, login };
}

test('the setup code creates only the first public administrator account', async (t) => {
  const { request, login } = await setup(t, { withAdmin: false });

  const invalidSetup = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Conta não autorizada',
      email: 'invalid-admin@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken: 'invalid-setup-code-that-is-long-enough',
    }),
  });
  assert.equal(invalidSetup.status, 403);

  const setupRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Primeiro Admin',
      email: 'first-admin@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken,
    }),
  });
  assert.equal(setupRegistration.status, 201);
  assert.equal((await setupRegistration.json()).user.role, 'admin');

  const repeatedSetup = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Segundo Admin',
      email: 'second-admin@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken,
    }),
  });
  assert.equal(repeatedSetup.status, 409);

  const normalRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Usuário Comum',
      email: 'common-after-setup@example.test',
      password: 'a-valid-password-2026',
      role: 'admin',
    }),
  });
  assert.equal(normalRegistration.status, 201);
  assert.equal((await normalRegistration.json()).user.role, 'citizen');

  const firstAdminCookie = await login('first-admin@example.test', 'a-valid-password-2026');
  const adminList = await request('/api/admin/users', { cookie: firstAdminCookie });
  assert.equal(adminList.status, 200);
});

test('the setup code can promote an existing citizen account after verifying its password', async (t) => {
  const { request } = await setup(t, { withAdmin: false });
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Conta existente',
      email: 'existing@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  assert.equal(registration.status, 201);
  assert.equal((await registration.json()).user.role, 'citizen');

  const invalidPasswordAttempt = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Conta existente',
      email: 'existing@example.test',
      password: 'another-valid-password',
      adminSetupToken,
    }),
  });
  assert.equal(invalidPasswordAttempt.status, 401);

  const promotion = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Conta existente',
      email: 'existing@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken,
    }),
  });
  assert.equal(promotion.status, 200);
  assert.equal((await promotion.json()).user.role, 'admin');
});

test('an authenticated citizen can promote their own account with the initial setup code', async (t) => {
  const { request } = await setup(t, { withAdmin: false });
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Minha conta',
      email: 'my-account@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  const user = (await registration.json()).user;
  const citizenCookie = await (async () => {
    const response = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: 'a-valid-password-2026' }),
    });
    assert.equal(response.status, 200);
    return response.headers.get('set-cookie').split(';')[0];
  })();

  const anonymousAttempt = await request('/api/auth/admin-setup', {
    method: 'POST',
    body: JSON.stringify({ adminSetupToken }),
  });
  assert.equal(anonymousAttempt.status, 401);

  const invalidCodeAttempt = await request('/api/auth/admin-setup', {
    cookie: citizenCookie,
    method: 'POST',
    body: JSON.stringify({ adminSetupToken: 'invalid-admin-setup-code-long-enough' }),
  });
  assert.equal(invalidCodeAttempt.status, 403);

  const promotion = await request('/api/auth/admin-setup', {
    cookie: citizenCookie,
    method: 'POST',
    body: JSON.stringify({ adminSetupToken }),
  });
  assert.equal(promotion.status, 200);
  assert.equal((await promotion.json()).user.role, 'admin');

  const session = await request('/api/auth/me', { cookie: citizenCookie });
  assert.equal((await session.json()).user.role, 'admin');

  const repeatedPromotion = await request('/api/auth/admin-setup', {
    cookie: citizenCookie,
    method: 'POST',
    body: JSON.stringify({ adminSetupToken }),
  });
  assert.equal(repeatedPromotion.status, 409);
});

test('the setup code can promote an account even when another administrator exists', async (t) => {
  const { request, login } = await setup(t);
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Outro Administrador',
      email: 'another-admin@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  assert.equal(registration.status, 201);
  assert.equal((await registration.json()).user.role, 'citizen');
  const cookie = await login('another-admin@example.test', 'a-valid-password-2026');

  const promotion = await request('/api/auth/admin-setup', {
    cookie,
    method: 'POST',
    body: JSON.stringify({ adminSetupToken }),
  });
  assert.equal(promotion.status, 200);
  assert.equal((await promotion.json()).user.role, 'admin');

  const users = await request('/api/admin/users', { cookie });
  assert.equal(users.status, 200);
});

test('the standard demo setup code works only when explicitly enabled outside production', async (t) => {
  const demo = await setup(t, {
    withAdmin: false,
    allowDemoAdminSetup: true,
    setupToken: null,
  });
  const demoRegistration = await demo.request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Administrador Demo',
      email: 'demo-admin@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken: 'mobcar-demo-admin-setup-2026-local',
    }),
  });
  assert.equal(demoRegistration.status, 201);
  assert.equal((await demoRegistration.json()).user.role, 'admin');

  const production = await setup(t, {
    withAdmin: false,
    production: true,
    setupToken: null,
  });
  const productionRegistration = await production.request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Administrador Demo',
      email: 'demo-admin@example.test',
      password: 'a-valid-password-2026',
      adminSetupToken: 'mobcar-demo-admin-setup-2026-local',
    }),
  });
  assert.equal(productionRegistration.status, 403);
});

test('application initialization does not automatically create an administrator', async (t) => {
  const { db } = await createApp({
    dbPath: ':memory:',
    allowedOrigins: [origin],
    webRoot: null,
    production: false,
  });
  t.after(() => db.close());
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get().count, 0);
});

test('demo occurrences API returns paginated, filtered anonymous sample data', async (t) => {
  const { request } = await setup(t);
  const response = await request('/api/v1/denuncias?regiao_administrativa=plano%20piloto&tipo=estacionamento');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    total: 1,
    items: [{
      id: 'MC-2026-0142',
      tipo: 'estacionamento',
      regiao_administrativa: 'Plano Piloto',
      localidade: 'Asa Sul',
      descricao: 'Veículo estacionado bloqueando a faixa de pedestres',
      data: '2026-03-18',
      status: 'Em análise',
    }],
    page: 1,
    pageSize: 25,
    demonstracao: true,
  });

  const invalidPage = await request('/api/v1/denuncias?page=0');
  assert.equal(invalidPage.status, 400);
});

test('admin user endpoints require an authenticated administrator', async (t) => {
  const { request, login } = await setup(t);

  const anonymous = await request('/api/admin/users');
  assert.equal(anonymous.status, 401);
  const anonymousCreate = await request('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'Novo Admin', email: 'novo@example.test', password: 'a-valid-password-2026' }),
  });
  assert.equal(anonymousCreate.status, 401);

  const cookie = await login(adminCredentials.email, adminCredentials.password);
  const authorized = await request('/api/admin/users', { cookie });
  assert.equal(authorized.status, 200);
  const created = await request('/api/admin/users', {
    method: 'POST',
    cookie,
    body: JSON.stringify({
      name: 'Novo Admin',
      email: 'novo-admin@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  assert.equal(created.status, 201);
  assert.deepEqual((await created.json()).user, {
    id: 2,
    name: 'Novo Admin',
    email: 'novo-admin@example.test',
    role: 'admin',
  });
  const newAdminCookie = await login('novo-admin@example.test', 'a-valid-password-2026');
  const newAdminSession = await request('/api/auth/me', { cookie: newAdminCookie });
  assert.equal((await newAdminSession.json()).user.role, 'admin');
});

test('registration creates a common account and admin promotion persists with accurate counts', async (t) => {
  const { request, login } = await setup(t);

  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Ana Souza',
      email: 'ana@example.test',
      password: 'a-valid-password-2026',
      role: 'admin',
    }),
  });
  assert.equal(registration.status, 201);
  const registeredUser = (await registration.json()).user;
  assert.equal(registeredUser.role, 'citizen');
  const commonCookie = await login('ana@example.test', 'a-valid-password-2026');

  const adminCookie = await login(adminCredentials.email, adminCredentials.password);
  const initialListResponse = await request('/api/admin/users?q=ana&role=citizen', {
    cookie: adminCookie,
  });
  assert.equal(initialListResponse.status, 200);
  const initialList = await initialListResponse.json();
  assert.equal(initialList.filteredTotal, 1);
  assert.equal(initialList.summary.total, 2);
  assert.equal(initialList.summary.common, 1);
  assert.equal(initialList.users[0].email, 'ana@example.test');

  const promotion = await request(`/api/admin/users/${registeredUser.id}/role`, {
    method: 'PATCH',
    cookie: adminCookie,
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(promotion.status, 200);
  assert.deepEqual((await promotion.json()).user, {
    ...registeredUser,
    role: 'analyst',
  });

  const updatedListResponse = await request('/api/admin/users?q=ana&role=analyst', {
    cookie: adminCookie,
  });
  const updatedList = await updatedListResponse.json();
  assert.equal(updatedList.filteredTotal, 1);
  assert.equal(updatedList.summary.common, 0);
  assert.equal(updatedList.summary.analysts, 1);

  const selfView = await request('/api/auth/me', { cookie: commonCookie });
  assert.equal((await selfView.json()).user.role, 'analyst');

  const secondRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Bruno Silva',
      email: 'bruno@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  const secondUser = (await secondRegistration.json()).user;
  const analystGrantAttempt = await request(`/api/admin/users/${secondUser.id}/role`, {
    method: 'PATCH',
    cookie: commonCookie,
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(analystGrantAttempt.status, 403);
  const adminCreateAttempt = await request('/api/admin/users', {
    method: 'POST',
    cookie: commonCookie,
    body: JSON.stringify({
      name: 'Admin não autorizado',
      email: 'unauthorized-admin@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  assert.equal(adminCreateAttempt.status, 403);
});

test('common users cannot read or change permissions, and foreign origins are rejected', async (t) => {
  const { request, login } = await setup(t);

  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Usuário Comum',
      email: 'common@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  const user = (await registration.json()).user;
  const commonCookie = await login('common@example.test', 'a-valid-password-2026');

  const listAttempt = await request('/api/admin/users', { cookie: commonCookie });
  assert.equal(listAttempt.status, 403);

  const grantAttempt = await request(`/api/admin/users/${user.id}/role`, {
    method: 'PATCH',
    cookie: commonCookie,
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(grantAttempt.status, 403);

  const adminCookie = await login(adminCredentials.email, adminCredentials.password);
  const csrfAttempt = await request(`/api/admin/users/${user.id}/role`, {
    method: 'PATCH',
    cookie: adminCookie,
    originHeader: 'https://attacker.example',
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(csrfAttempt.status, 403);
});

test('an administrator cannot be changed through the analyst promotion endpoint', async (t) => {
  const { request, login } = await setup(t);
  const adminCookie = await login(adminCredentials.email, adminCredentials.password);
  const list = await (await request('/api/admin/users', { cookie: adminCookie })).json();
  const admin = list.users.find((user) => user.role === 'admin');

  const response = await request(`/api/admin/users/${admin.id}/role`, {
    method: 'PATCH',
    cookie: adminCookie,
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(response.status, 409);

  const self = await request('/api/auth/me', { cookie: adminCookie });
  assert.equal((await self.json()).user.role, 'admin');
});

test('promoted roles remain in SQLite after the server restarts', async (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'mobcar-users-'));
  const dbPath = join(directory, 'users.sqlite');
  let running;

  const start = async () => {
    const app = await createApp({
      dbPath,
      allowedOrigins: [origin],
      webRoot: null,
      production: false,
    });
    const server = app.app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    running = { ...app, server, baseUrl: `http://127.0.0.1:${server.address().port}` };
  };
  const close = async () => {
    if (!running) return;
    await new Promise((resolve, reject) => {
      running.server.close((error) => {
        running.db.close();
        if (error) reject(error);
        else resolve();
      });
    });
    running = undefined;
  };
  const request = (path, { cookie, ...options } = {}) => fetch(`${running.baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });

  t.after(async () => {
    await close();
    rmSync(directory, { recursive: true, force: true });
  });

  await createAdminAccount({ dbPath, ...adminCredentials });
  await start();
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Persistência Teste',
      email: 'persistencia@example.test',
      password: 'a-valid-password-2026',
    }),
  });
  const promotedUser = (await registration.json()).user;
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: adminCredentials.email,
      password: adminCredentials.password,
    }),
  });
  const adminCookie = adminLogin.headers.get('set-cookie').split(';')[0];
  const promotion = await request(`/api/admin/users/${promotedUser.id}/role`, {
    method: 'PATCH',
    cookie: adminCookie,
    body: JSON.stringify({ role: 'analyst' }),
  });
  assert.equal(promotion.status, 200);

  await close();
  await start();
  const newAdminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: adminCredentials.email,
      password: adminCredentials.password,
    }),
  });
  const newAdminCookie = newAdminLogin.headers.get('set-cookie').split(';')[0];
  const persistedList = await request('/api/admin/users?q=persistencia&role=analyst', {
    cookie: newAdminCookie,
  });
  const result = await persistedList.json();
  assert.equal(persistedList.status, 200);
  assert.equal(result.filteredTotal, 1);
  assert.equal(result.users[0].email, 'persistencia@example.test');
  assert.equal(result.users[0].role, 'analyst');
});
