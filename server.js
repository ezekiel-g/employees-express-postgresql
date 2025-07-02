import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createPool, closePool } from './api/v1/db/db.js';
import createCrudRouter from './api/v1/factories/createCrudRouter.js';

dotenv.config();

const app = express();
const { PORT } = process.env;
const pool = createPool();
const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1/departments', createCrudRouter(pool, 'departments'));
app.use('/api/v1/employees', createCrudRouter(pool, 'employees'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await closePool(pool);
  process.exit(0);
});
