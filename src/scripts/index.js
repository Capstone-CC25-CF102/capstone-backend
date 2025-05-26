import express from 'express';
import db from './config/database.js';
import Users from './models/UserModel.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router/router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log('Database connected successfully.');
  await Users.sync();
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log('Server is running on port 5000'));