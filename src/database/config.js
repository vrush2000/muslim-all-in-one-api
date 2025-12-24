import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Helper to find the database file with detailed logging
const getDbPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const cwd = process.cwd();

  console.log('--- DEBUG DATABASE PATH ---');
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', cwd);

  const paths = [
    { name: 'Vercel Standard', path: '/var/task/src/database/alquran.db' },
    { name: 'CWD Root', path: join(cwd, 'alquran.db') },
    { name: 'CWD Database', path: join(cwd, 'src', 'database', 'alquran.db') },
    { name: 'Bundled Relative', path: join(__dirname, '..', 'src', 'database', 'alquran.db') },
    { name: 'Bundled Same Dir', path: join(__dirname, 'alquran.db') }
  ];

  for (const p of paths) {
    const exists = fs.existsSync(p.path);
    console.log(`Checking ${p.name}: ${p.path} [${exists ? 'EXISTS' : 'NOT FOUND'}]`);
    if (exists) return p.path;
  }

  console.log('--- END DEBUG DATABASE PATH ---');
  return join(cwd, 'src', 'database', 'alquran.db');
};

let db;
try {
  const dbFile = getDbPath();
  console.log(`Initializing database at: ${dbFile}`);
  
  db = new Database(dbFile, { 
    readonly: true,
    fileMustExist: false,
    timeout: 10000
  });
  
  console.log('Database connection established successfully');
  
  // Optimization for better-sqlite3 - NEVER use WAL in production/Vercel
  if (!isProduction) {
    try {
      db.pragma('journal_mode = WAL');
      db.pragma('synchronous = NORMAL');
    } catch (e) {
      console.warn('Could not set PRAGMA:', e);
    }
  }
} catch (error) {
  console.error('FAILED TO INITIALIZE DATABASE:', error);
  // Create a mock db object that throws on queries to prevent app crash on startup
  db = {
    prepare: () => ({
      all: () => { throw new Error('Database not initialized: ' + error.message) },
      get: () => { throw new Error('Database not initialized: ' + error.message) }
    }),
    pragma: () => {}
  };
}

/**
 * Helper to run a query that returns multiple rows
 */
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Helper to run a query that returns a single row
 */
export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(params);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
};

export default db;
