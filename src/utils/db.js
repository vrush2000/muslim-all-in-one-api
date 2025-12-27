import { createClient } from '@libsql/client/web';
// import 'dotenv/config'; // Vercel handles env variables natively

const url = process.env.TURSO_DATABASE_URL || "";
const authToken = process.env.TURSO_AUTH_TOKEN || "";

if (!url) {
  console.warn("WARNING: TURSO_DATABASE_URL is not defined in environment variables.");
}

export const client = createClient({
  url: url,
  authToken: authToken,
});

/**
 * Execute a query on the Turso database
 * @param {string} sql 
 * @param {Array} args 
 * @returns {Promise<any>}
 */
export async function dbQuery(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

/**
 * Get a single row from the database
 * @param {string} sql 
 * @param {Array} args 
 * @returns {Promise<any>}
 */
export async function dbGet(sql, args = []) {
  const result = await dbQuery(sql, args);
  return result.rows[0] || null;
}

/**
 * Get all rows from the database
 * @param {string} sql 
 * @param {Array} args 
 * @returns {Promise<any[]>}
 */
export async function dbAll(sql, args = []) {
  const result = await dbQuery(sql, args);
  return result.rows;
}

/**
 * Initialize database tables if they don't exist
 */
export async function initDB() {
  try {
    // Create global_stats table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS global_stats (
        key TEXT PRIMARY KEY,
        value INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create item_stats table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS item_stats (
        type TEXT,
        item_id TEXT,
        count INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (type, item_id)
      )
    `);

    // Initialize global_stats if empty
    const stats = await dbAll("SELECT key FROM global_stats");
    if (stats.length === 0) {
      await dbQuery("INSERT INTO global_stats (key, value) VALUES ('total_reads', 0)");
      await dbQuery("INSERT INTO global_stats (key, value) VALUES ('global_khatam', 0)");
      console.log('Database initialized with default stats.');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
