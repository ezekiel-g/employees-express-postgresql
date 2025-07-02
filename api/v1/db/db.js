import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const createPool = async () => {
  let pool = new Pool({ connectionString: process.env.DB_URI });

  try {
    const sqlResult = await pool.query('SELECT 1;');

    if (sqlResult && sqlResult.rows) console.log('Connected to database');
  } catch (error) {
    pool = null;
    console.error('Error connecting to database:', error);
  }

  return pool;
};

const closePool = async (pool) => {
  try {
    await pool.end();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

export { createPool, closePool };
