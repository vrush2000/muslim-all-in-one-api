import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFile = join(__dirname, 'alquran.db');

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const db = new Database(dbFile, { 
  readonly: isProduction 
});

// Optimization for better-sqlite3
if (!isProduction) {
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
}

export const query = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('PRAGMA')) {
      return Promise.resolve(Array.isArray(params) ? stmt.all(...params) : stmt.all(params));
    } else {
      const result = Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
      return Promise.resolve(result);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const get = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    return Promise.resolve(Array.isArray(params) ? stmt.get(...params) : stmt.get(params));
  } catch (err) {
    return Promise.reject(err);
  }
};

export default db;
