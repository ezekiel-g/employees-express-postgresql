import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const dbConnection = new Pool({ connectionString: process.env.DB_URI });

export default dbConnection;
