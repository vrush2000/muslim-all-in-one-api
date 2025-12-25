import Database from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

const isProduction = process.env.VERCEL === '1';

// Cache database instance
let db;
let dbInitialized = false;

const initializeDatabase = () => {
  if (dbInitialized && db) return db;

  try {
    let dbPath;

    if (isProduction) {
      // Di Vercel, copy database ke /tmp (writable directory)
      const tmpDbPath = '/tmp/alquran.db';
      const sourceDbPath = join(process.cwd(), 'src', 'database', 'alquran.db');

      console.log('Production mode - copying DB to /tmp');
      
      // Copy database file jika belum ada
      if (!fs.existsSync(tmpDbPath)) {
        if (!fs.existsSync(sourceDbPath)) {
          throw new Error(`Source database not found: ${sourceDbPath}`);
        }
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log('Database copied to /tmp');
      }
      
      dbPath = tmpDbPath;
    } else {
      // Development mode
      dbPath = join(process.cwd(), 'src', 'database', 'alquran.db');
    }

    console.log(`Initializing database at: ${dbPath}`);

    db = new Database(dbPath, {
      readonly: true,
      fileMustExist: true,
    });

    // Optimize for read-only operations
    db.pragma('journal_mode = OFF');
    db.pragma('query_only = ON');
    db.pragma('synchronous = OFF');
    db.pragma('temp_store = MEMORY');
    db.pragma('cache_size = -8000'); // 8MB cache

    dbInitialized = true;
    console.log('Database initialized successfully');
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const query = async (sql, params = []) => {
  const database = initializeDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(params);
};

export const get = async (sql, params = []) => {
  const database = initializeDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(params);
};

export const run = async (sql, params = []) => {
  const database = initializeDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(params);
};

export default initializeDatabase;