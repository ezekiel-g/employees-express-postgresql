import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import createCrudRouter from './api/v1/factories/createCrudRouter.js';

dotenv.config();

const app = express();
const { PORT } = process.env;
const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1/departments', createCrudRouter('departments'));
app.use('/api/v1/employees', createCrudRouter('employees'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
