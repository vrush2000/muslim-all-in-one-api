import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Helper to find the database file
const getDbPath = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 1. Coba di direktori yang sama (untuk bundled api/index.js di Vercel)
    const path1 = join(__dirname, 'alquran.db');
    if (fs.existsSync(path1)) return path1;

    // 2. Coba di src/database/ (untuk local dev)
    const path2 = join(process.cwd(), 'src', 'database', 'alquran.db');
    if (fs.existsSync(path2)) return path2;

    // 3. Coba di api/ (fallback)
    const path3 = join(process.cwd(), 'api', 'alquran.db');
    if (fs.existsSync(path3)) return path3;

    // 4. Vercel specific path (sometimes files are in /var/task/)
    const path4 = join('/var/task', 'src', 'database', 'alquran.db');
    if (fs.existsSync(path4)) return path4;

    return path1;
  } catch (e) {
    console.error('Error finding database path:', e);
    return join(process.cwd(), 'src', 'database', 'alquran.db');
  }
};

let db;
try {
  const dbFile = getDbPath();
  console.log(`Initializing database at: ${dbFile}`);
  
  db = new Database(dbFile, { 
    readonly: isProduction,
    fileMustExist: false
  });
  
  console.log('Database connection established successfully');
  
  if (!isProduction) {
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
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
