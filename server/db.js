import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'server.sqlite'));

// Initialize users table
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  display_name TEXT,
  created_at INTEGER
);
`);

export default db;
