import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

let pool = null;

export async function init() {
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) return null;
  pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Ensure users table exists
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL,
      display_name VARCHAR(255),
      created_at BIGINT
    )
  `);

  return pool;
}

export function getPool() {
  if (!pool) throw new Error('MySQL pool not initialized. Call init() first.');
  return pool;
}

export async function findUserByUsername(username) {
  const p = getPool();
  const [rows] = await p.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

export async function createUser(user) {
  const p = getPool();
  const { id, username, password_hash, role, display_name, created_at } = user;
  await p.execute(
    'INSERT INTO users (id, username, password_hash, role, display_name, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, username, password_hash, role, display_name, created_at]
  );
}
