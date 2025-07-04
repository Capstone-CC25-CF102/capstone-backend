import express from 'express';
import db from './config/database.js';
import Users from './models/UserModel.js';
import Places from './models/PlaceModel.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router/router.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', __dirname);
console.log('Gambar folder path:', path.join(__dirname, 'gambar'));
console.log('Gambar folder exists:', fs.existsSync(path.join(__dirname, 'gambar')));

const gambarPath = path.join(__dirname, 'gambar');
if (fs.existsSync(gambarPath)) {
  const files = fs.readdirSync(gambarPath);
  console.log('Files in gambar folder:', files);
} else {
  console.log('Gambar folder does not exist!');
}

const specificFile = path.join(__dirname, 'gambar', 'Alas-Purwo-National-Park.jpg');
console.log('Specific file exists:', fs.existsSync(specificFile));

try {
  await db.authenticate();
  console.log('Database connected successfully.');
  await Users.sync();
  await Places.sync();
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: [
    'https://capstone-zeta-five.vercel.app', 
    'http://localhost:5173',
    'http://127.0.0.1:5000/recommend',
    'http://127.0.0.1:5000'
  ],
  credentials: true, 
  methods: ['GET', 'POST', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/gambar', (req, res, next) => {
  console.log('Static file requested:', req.url);
  console.log('Full path:', path.join(__dirname, 'gambar', req.url));
  console.log('File exists:', fs.existsSync(path.join(__dirname, 'gambar', req.url)));
  next();
});

app.use('/gambar', express.static(path.join(__dirname, 'gambar')));
app.use(router);

app.listen(5000, () => console.log('Server is running on port 5000'));