import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const createPool = () => {
  let pool;

  try {
    pool = new Pool({ connectionString: process.env.DB_URI });
    console.log('Database connection pool created');
  } catch (error) {
    console.error('Error creating database connection pool:', error.message);
    process.exit(1);
  }

  return pool;
};

const closePool = async (pool) => {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing database connection pool:', error.message);
  }
};

export { createPool, closePool };
