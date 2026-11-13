import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

const SESSION_COOKIE = 'mobcar_session';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const PASSWORD_MAX_BYTES = 72;
const PASSWORD_MIN_LENGTH = 12;
const DEMO_ADMIN_SETUP_TOKEN = 'mobcar-demo-admin-setup-2026-local';
const demoOccurrences = [
  {
    id: 'MC-2026-0142',
    tipo: 'estacionamento',
    regiao_administrativa: 'Plano Piloto',
    localidade: 'Asa Sul',
    descricao: 'Veículo estacionado bloqueando a faixa de pedestres',
    data: '2026-03-18',
    status: 'Em análise',
  },
  {
    id: 'MC-2026-0098',
    tipo: 'conversao_proibida',
    regiao_administrativa: 'Plano Piloto',
    localidade: 'Eixo Monumental',
    descricao: 'Conversão proibida em cruzamento sinalizado',
    data: '2026-03-12',
    status: 'Aprovada',
  },
  {
    id: 'MC-2026-0041',
    tipo: 'vaga_reservada',
    regiao_administrativa: 'Plano Piloto',
    localidade: 'Asa Norte',
    descricao: 'Parada em vaga reservada sem identificação',
    data: '2026-02-28',
    status: 'Rejeitada',
  },
];

const publicUser = ({ id, name, email, role }) => ({ id, name, email, role });
const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const normalizeEmail = (email) => email.trim().toLowerCase();
const matchesAdminSetupToken = (candidate, configuredToken) => {
  if (typeof candidate !== 'string' || candidate.length < 32
    || typeof configuredToken !== 'string' || configuredToken.length < 32
    || Buffer.byteLength(candidate, 'utf8') !== Buffer.byteLength(configuredToken, 'utf8')) {
    return false;
  }
  return timingSafeEqual(Buffer.from(candidate, 'utf8'), Buffer.from(configuredToken, 'utf8'));
};

function createDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });

  const db = new Database(path);
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'citizen'
        CHECK (role IN ('citizen', 'analyst', 'admin')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
  `);
  db.prepare('DELETE FROM auth_sessions WHERE expires_at <= ?').run(Date.now());
  return db;
}

async function createInitialAdmin(db, { name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be set together.');
  }
  if (name.trim().length < 2 || name.trim().length > 120
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < PASSWORD_MIN_LENGTH
    || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
    throw new Error('The configured bootstrap administrator has invalid credentials.');
  }

  const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (existingAdmin) return;

  const existingAccount = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizeEmail(email));
  if (existingAccount) {
    throw new Error('The bootstrap administrator email is already registered as a non-admin account.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = Date.now();
  db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'admin', ?, ?)
  `).run(name.trim(), normalizeEmail(email), passwordHash, now, now);
}

export async function createAdminAccount({
  dbPath = process.env.DATABASE_PATH || resolve('data/mobcar.sqlite'),
  name,
  email,
  password,
}) {
  const db = createDatabase(dbPath);
  try {
    await createInitialAdmin(db, { name, email, password });
  } finally {
    db.close();
  }
}

function readCookie(request, name) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  const item = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!item) return null;

  try {
    return decodeURIComponent(item.slice(name.length + 1));
  } catch {
    return null;
  }
}

function parseAllowedOrigins(configuredOrigins) {
  return new Set(configuredOrigins.map((origin) => new URL(origin).origin));
}

export async function createApp({
  dbPath = process.env.DATABASE_PATH || resolve('data/mobcar.sqlite'),
  initialAdminSetupToken = process.env.INITIAL_ADMIN_SETUP_TOKEN,
  allowDemoAdminSetup = false,
  allowedOrigins = process.env.APP_ORIGIN
    ? [process.env.APP_ORIGIN]
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8443', 'http://127.0.0.1:8443'],
  webRoot = resolve('dist'),
  production = process.env.NODE_ENV === 'production',
} = {}) {
  const db = createDatabase(dbPath);
  const origins = parseAllowedOrigins(allowedOrigins);
  const adminSetupToken = initialAdminSetupToken
    || (allowDemoAdminSetup && !production ? DEMO_ADMIN_SETUP_TOKEN : undefined);
  if (production && [...origins].some((origin) => new URL(origin).protocol !== 'https:')) {
    db.close();
    throw new Error('Production APP_ORIGIN values must use HTTPS.');
  }
  const app = express();
  app.disable('x-powered-by');
  if (production) app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use('/api', (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    const requestOrigin = request.get('origin');
    if (requestOrigin && origins.has(requestOrigin)) {
      response.set('Access-Control-Allow-Origin', requestOrigin);
      response.set('Access-Control-Allow-Credentials', 'true');
      response.vary('Origin');
      if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
        return response.status(204).end();
      }
    }
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      if (!requestOrigin || !origins.has(requestOrigin)) {
        return response.status(403).json({ error: 'Origem da solicitação não autorizada.' });
      }
    }
    next();
  });

  const findSessionUser = db.prepare(`
    SELECT users.id, users.name, users.email, users.role
    FROM auth_sessions
    JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.token_hash = ? AND auth_sessions.expires_at > ?
  `);

  app.use('/api', (request, _response, next) => {
    const token = readCookie(request, SESSION_COOKIE);
    request.authTokenHash = token ? hashToken(token) : null;
    request.authUser = request.authTokenHash
      ? findSessionUser.get(request.authTokenHash, Date.now()) ?? null
      : null;
    next();
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de acesso. Tente novamente mais tarde.' },
  });
  const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
  });
  const adminRegistrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de criação de administrador. Tente novamente mais tarde.' },
  });
  const adminPromotionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de promoção. Tente novamente mais tarde.' },
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: production ? 'none' : 'strict',
    secure: production,
    path: '/',
    maxAge: SESSION_DURATION_MS,
  };
  const createSession = (userId, response) => {
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    db.prepare(`
      INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).run(hashToken(token), userId, now + SESSION_DURATION_MS, now);
    response.cookie(SESSION_COOKIE, token, cookieOptions);
  };
  const deleteCurrentSession = (request) => {
    if (request.authTokenHash) {
      db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(request.authTokenHash);
    }
  };

  const requireAuthenticated = (request, response, next) => {
    if (!request.authUser) {
      return response.status(401).json({ error: 'Autenticação necessária.' });
    }
    next();
  };
  const requireAdmin = (request, response, next) => {
    if (!request.authUser || request.authUser.role !== 'admin') {
      return response.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    next();
  };

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.get('/api/v1/denuncias', (request, response) => {
    const region = typeof request.query.regiao_administrativa === 'string'
      ? request.query.regiao_administrativa.trim()
      : '';
    const type = typeof request.query.tipo === 'string' ? request.query.tipo.trim() : '';
    const parsedPage = Number(request.query.page ?? 1);
    const parsedPageSize = Number(request.query.limit ?? 25);

    if (region.length > 100 || type.length > 80
      || !Number.isSafeInteger(parsedPage) || parsedPage < 1
      || !Number.isSafeInteger(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 100) {
      return response.status(400).json({ error: 'Filtros ou paginação inválidos.' });
    }

    const filtered = demoOccurrences.filter((occurrence) =>
      (!region || occurrence.regiao_administrativa.toLocaleLowerCase('pt-BR') === region.toLocaleLowerCase('pt-BR'))
      && (!type || occurrence.tipo.toLocaleLowerCase('pt-BR') === type.toLocaleLowerCase('pt-BR')));
    const start = (parsedPage - 1) * parsedPageSize;
    response.json({
      total: filtered.length,
      items: filtered.slice(start, start + parsedPageSize),
      page: parsedPage,
      pageSize: parsedPageSize,
      demonstracao: true,
    });
  });

  app.get('/api/auth/me', (request, response) => {
    response.json({ user: request.authUser ? publicUser(request.authUser) : null });
  });

  app.post('/api/auth/admin-setup', requireAuthenticated, adminPromotionLimiter, (request, response) => {
    const setupToken = request.body?.adminSetupToken;
    if (!matchesAdminSetupToken(setupToken, adminSetupToken)) {
      return response.status(403).json({ error: 'Código de configuração inválido.' });
    }

    const now = Date.now();
    const promotedUser = db.transaction(() => {
      const updated = db.prepare(`
        UPDATE users SET role = 'admin', updated_at = ?
        WHERE id = ? AND role = 'citizen'
      `).run(now, request.authUser.id);
      if (updated.changes !== 1) return null;
      return db.prepare('SELECT id, name, email, role FROM users WHERE id = ?')
        .get(request.authUser.id);
    }).immediate();

    if (!promotedUser) {
      return response.status(409).json({ error: 'Esta conta já é administradora ou não pode ser promovida.' });
    }
    response.json({ user: publicUser(promotedUser) });
  });

  app.post('/api/auth/register', registrationLimiter, async (request, response) => {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body?.email === 'string' ? normalizeEmail(request.body.email) : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const setupToken = typeof request.body?.adminSetupToken === 'string' ? request.body.adminSetupToken : '';

    if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || email.length > 254 || password.length < PASSWORD_MIN_LENGTH
      || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      return response.status(400).json({
        error: `Informe nome e e-mail válidos e uma senha de ${PASSWORD_MIN_LENGTH} a ${PASSWORD_MAX_BYTES} bytes.`,
      });
    }

    let createAdmin = false;
    if (request.body?.adminSetupToken !== undefined) {
      if (!matchesAdminSetupToken(setupToken, adminSetupToken)) {
        return response.status(403).json({ error: 'Código de configuração inválido.' });
      }
      createAdmin = true;
    }

    const now = Date.now();
    const existingAccount = db.prepare('SELECT id, password_hash, role FROM users WHERE email = ?').get(email);
    if (createAdmin && existingAccount) {
      if (existingAccount.role !== 'citizen') {
        return response.status(409).json({ error: 'Esta conta não pode ser usada para criar o administrador inicial.' });
      }
      if (!await bcrypt.compare(password, existingAccount.password_hash)) {
        return response.status(401).json({ error: 'A senha não corresponde à conta já cadastrada.' });
      }

      const promotedUser = db.transaction(() => {
        if (db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) return null;
        const updated = db.prepare(`
          UPDATE users SET role = 'admin', updated_at = ?
          WHERE id = ? AND role = 'citizen'
        `).run(now, existingAccount.id);
        if (updated.changes !== 1) return null;
        return db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(existingAccount.id);
      }).immediate();
      if (!promotedUser) {
        return response.status(409).json({ error: 'A conta administradora inicial já foi criada.' });
      }
      return response.json({ user: publicUser(promotedUser) });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let result;
    try {
      result = db.transaction(() => {
        if (createAdmin && db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) {
          return null;
        }
        return db.prepare(`
          INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(name, email, passwordHash, createAdmin ? 'admin' : 'citizen', now, now);
      }).immediate();
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return response.status(409).json({ error: 'Já existe uma conta cadastrada com este e-mail.' });
      }
      throw error;
    }
    if (!result) {
      return response.status(409).json({ error: 'A conta administradora inicial já foi criada.' });
    }

    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?')
      .get(Number(result.lastInsertRowid));
    response.status(201).json({ user: publicUser(user) });
  });

  app.post('/api/auth/login', loginLimiter, async (request, response) => {
    const email = typeof request.body?.email === 'string' ? normalizeEmail(request.body.email) : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const account = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email);
    const validPassword = account && password.length <= PASSWORD_MAX_BYTES
      ? await bcrypt.compare(password, account.password_hash)
      : false;

    if (!validPassword) {
      return response.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    deleteCurrentSession(request);
    createSession(account.id, response);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(account.id);
    response.json({ user: publicUser(user) });
  });

  app.post('/api/auth/logout', (request, response) => {
    deleteCurrentSession(request);
    response.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined });
    response.status(204).end();
  });

  app.get('/api/admin/users', requireAuthenticated, requireAdmin, (request, response) => {
    const query = typeof request.query.q === 'string' ? request.query.q.trim().slice(0, 120) : '';
    const role = typeof request.query.role === 'string' ? request.query.role : 'all';
    const allowedRoles = new Set(['all', 'admin', 'analyst', 'citizen']);
    if (!allowedRoles.has(role)) {
      return response.status(400).json({ error: 'Filtro de papel inválido.' });
    }

    const parsedPage = Number(request.query.page ?? 1);
    const requestedPage = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const pageSize = 25;
    const conditions = [];
    const parameters = [];
    if (query) {
      conditions.push('(instr(lower(name), lower(?)) > 0 OR instr(lower(email), lower(?)) > 0)');
      parameters.push(query, query);
    }
    if (role !== 'all') {
      conditions.push('role = ?');
      parameters.push(role);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const filteredTotal = db.prepare(`SELECT COUNT(*) AS count FROM users ${where}`)
      .get(...parameters).count;
    const page = Math.min(requestedPage, Math.max(1, Math.ceil(filteredTotal / pageSize)));
    const users = db.prepare(`
      SELECT id, name, email, role
      FROM users
      ${where}
      ORDER BY name COLLATE NOCASE, id
      LIMIT ? OFFSET ?
    `).all(...parameters, pageSize, (page - 1) * pageSize);
    const summary = db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN role = 'citizen' THEN 1 ELSE 0 END) AS common,
        SUM(CASE WHEN role = 'analyst' THEN 1 ELSE 0 END) AS analysts
      FROM users
    `).get();

    response.json({
      users: users.map(publicUser),
      summary: {
        total: summary.total,
        common: summary.common ?? 0,
        analysts: summary.analysts ?? 0,
      },
      filteredTotal,
      page,
      pageSize,
    });
  });

  app.post('/api/admin/users', requireAuthenticated, requireAdmin, adminRegistrationLimiter, async (request, response) => {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body?.email === 'string' ? normalizeEmail(request.body.email) : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';

    if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || email.length > 254 || password.length < PASSWORD_MIN_LENGTH
      || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      return response.status(400).json({
        error: `Informe nome e e-mail válidos e uma senha de ${PASSWORD_MIN_LENGTH} a ${PASSWORD_MAX_BYTES} bytes.`,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = Date.now();
    let result;
    try {
      result = db.prepare(`
        INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, 'admin', ?, ?)
      `).run(name, email, passwordHash, now, now);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return response.status(409).json({ error: 'Já existe uma conta cadastrada com este e-mail.' });
      }
      throw error;
    }

    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?')
      .get(Number(result.lastInsertRowid));
    response.status(201).json({ user: publicUser(user) });
  });

  app.patch('/api/admin/users/:id/role', requireAuthenticated, requireAdmin, (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id < 1 || request.body?.role !== 'analyst') {
      return response.status(400).json({ error: 'Solicitação de alteração de papel inválida.' });
    }

    const target = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
    if (!target) return response.status(404).json({ error: 'Usuário não encontrado.' });
    if (target.role === 'admin') {
      return response.status(409).json({ error: 'O papel de administrador não pode ser alterado por esta operação.' });
    }
    if (target.role !== 'citizen') {
      return response.status(409).json({ error: 'Somente usuários comuns podem receber o papel de analista.' });
    }

    const updated = db.prepare(`
      UPDATE users SET role = 'analyst', updated_at = ?
      WHERE id = ? AND role = 'citizen'
    `).run(Date.now(), id);
    if (updated.changes !== 1) {
      return response.status(409).json({ error: 'O papel do usuário já foi alterado.' });
    }

    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
    response.json({ user: publicUser(user) });
  });

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'Recurso da API não encontrado.' });
  });

  if (webRoot) {
    app.use(express.static(webRoot, { index: false }));
    app.get(/.*/, (_request, response, next) => {
      response.sendFile(resolve(webRoot, 'index.html'), (error) => {
        if (error) next(error);
      });
    });
  }

  app.use((error, _request, response, _next) => {
    if (response.headersSent) return;
    if (error.status === 400 && error.type === 'entity.parse.failed') {
      return response.status(400).json({ error: 'Corpo JSON inválido.' });
    }
    if (error.status === 413) {
      return response.status(413).json({ error: 'A solicitação excede o tamanho permitido.' });
    }
    console.error('MobCar server request failed:', error);
    response.status(500).json({ error: 'Não foi possível concluir a solicitação.' });
  });

  return { app, db };
}
