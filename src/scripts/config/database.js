import { Sequelize } from "sequelize";
import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

// Log variabel lingkungan untuk debugging
console.log("Environment variables:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS ? "[HIDDEN]" : undefined,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  dialectModule: pg
});

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true, // Supabase memerlukan SSL
        rejectUnauthorized: false, // Nonaktifkan verifikasi sertifikat
      },
    },
    pool: {
      max: 5, // Maksimum koneksi
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: (msg) => console.log("Sequelize:", msg), // Aktifkan logging untuk debugging
  }
);

// Test koneksi
(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi ke Supabase Transaction Pooler berhasil!");
  } catch (error) {
    console.error("Gagal terhubung ke Supabase:", error.message);
    console.error("Detail error:", error);
  }
})();

export default db;