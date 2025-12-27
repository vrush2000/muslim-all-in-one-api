import { createClient } from '@libsql/client/web';
import 'dotenv/config';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

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
