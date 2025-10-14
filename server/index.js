import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from './store.js';
import * as mysqlHelper from './mysql.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_in_production';

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Whether MySQL was initialized successfully. When true, auth will use MySQL only (no file-store fallback)
let USING_MYSQL = false;

// Seed users if not present and start server inside async IIFE
(async function main() {
  // Try to initialize MySQL if environment variables are present. If not, use file-based store.
  let usingMySQL = false;
  try {
    const pool = await mysqlHelper.init();
    if (pool) {
      usingMySQL = true;
      USING_MYSQL = true;
      console.log('Using MySQL for user storage');
      // check if users table has rows
      const [rows] = await pool.execute('SELECT COUNT(1) as cnt FROM users');
      const count = rows[0]?.cnt || 0;
      if (count === 0) {
        const pw1 = bcrypt.hashSync('pass123', 8);
        const pw2 = bcrypt.hashSync('pass123', 8);
        await mysqlHelper.createUser({ id: randomUUID(), username: 'manufacturer', password_hash: pw1, role: 'manufacturer', display_name: 'Manufacturer', created_at: Date.now() });
        await mysqlHelper.createUser({ id: randomUUID(), username: 'vendor', password_hash: pw2, role: 'vendor', display_name: 'Vendor', created_at: Date.now() });
        console.log('Seeded users in MySQL: manufacturer / vendor (password: pass123)');
      }
    }
  } catch (e) {
    console.log('MySQL init failed, falling back to file store:', e.message);
  }

  if (!usingMySQL) {
    const data = await db.read();
    data.users ||= [];
    if (!data.users || data.users.length === 0) {
      const pw1 = bcrypt.hashSync('pass123', 8);
      const pw2 = bcrypt.hashSync('pass123', 8);
      data.users.push({ id: randomUUID(), username: 'manufacturer', password_hash: pw1, role: 'manufacturer', display_name: 'Manufacturer', created_at: Date.now() });
      data.users.push({ id: randomUUID(), username: 'vendor', password_hash: pw2, role: 'vendor', display_name: 'Vendor', created_at: Date.now() });
      await db.write(data);
      console.log('Seeded users: manufacturer / vendor (password: pass123)');
    }
  }

  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
  });
})();

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  let row = null;
  try {
    if (USING_MYSQL) {
      // Require presence in MySQL only
      row = await mysqlHelper.findUserByUsername(username);
      if (!row) return res.status(401).json({ error: 'new user, invalid login details' });
    } else {
      // Try MySQL if available, otherwise fallback to file store
      try {
        const pool = mysqlHelper.getPool();
        row = await mysqlHelper.findUserByUsername(username);
      } catch (e) {
        row = null;
      }
      if (!row) {
        const data = await db.read();
        data.users ||= [];
        row = data.users.find(u => u.username === username);
      }
      if (!row) return res.status(401).json({ error: 'invalid credentials' });
    }
  } catch (e) {
    console.error('Login error', e);
    return res.status(500).json({ error: 'internal error' });
  }
  const match = bcrypt.compareSync(password, row.password_hash);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });

  const token = signToken({ id: row.id, username: row.username, role: row.role });
  // Set HttpOnly cookie
  res.cookie('ips_token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ id: row.id, username: row.username, role: row.role, displayName: row.display_name });
});

app.post('/api/auth/signup', async (req, res) => {
  const { username, password, role, display_name } = req.body || {};
  if (!username || !password || !role) return res.status(400).json({ error: 'username, password and role required' });

  console.log('Signup attempt:', { username, role, display_name });

  // check if user exists in MySQL first
  try {
    let exists = false;
    try {
      const pool = mysqlHelper.getPool();
      const existing = await mysqlHelper.findUserByUsername(username);
      exists = !!existing;
    } catch (e) {
      // pool not initialized or error -> fallback to file store below
      exists = false;
    }

    if (exists) return res.status(409).json({ error: 'username already exists' });

    const password_hash = bcrypt.hashSync(password, 8);
    const id = randomUUID();
    const created_at = Date.now();

    if (USING_MYSQL) {
      // create only in MySQL
      try {
        await mysqlHelper.createUser({ id, username, password_hash, role, display_name, created_at });
        const token = signToken({ id, username, role });
        res.cookie('ips_token', token, { httpOnly: true, sameSite: 'lax' });
        return res.status(201).json({ id, username, role, displayName: display_name });
      } catch (e) {
        console.error('MySQL create user error', e);
        return res.status(500).json({ error: 'internal error' });
      }
    }

    // fallback: write to file store
    const data = await db.read();
    data.users ||= [];
    data.users.push({ id, username, password_hash, role, display_name, created_at });
    await db.write(data);
    const token = signToken({ id, username, role });
    res.cookie('ips_token', token, { httpOnly: true, sameSite: 'lax' });
    return res.status(201).json({ id, username, role, displayName: display_name });
  } catch (e) {
    console.error('Signup error', e);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('ips_token');
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.ips_token || req.headers?.authorization?.replace(/^Bearer\s+/, '') || null;
  if (!token) return res.status(401).json({ error: 'not authenticated' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });
  // payload should have id, username, role
  return res.json({ id: payload.id, username: payload.username, role: payload.role });
});

// server is started in async IIFE
