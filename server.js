import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createPool, closePool } from './api/v1/db/db.js';
import crudEndpoints from './api/v1/endpoints/crudEndpoints.js';

dotenv.config();

const pool = await createPool();

if (!pool) process.exit(1);

const app = express();
const { PORT } = process.env;
const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1/departments', crudEndpoints(pool, 'departments'));
app.use('/api/v1/employees', crudEndpoints(pool, 'employees'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await closePool(pool);
  process.exit(0);
});
