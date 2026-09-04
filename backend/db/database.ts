import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

//fix: enable SSL for Render PostgreSQL connection

// const db = new Pool({
//   connectionString,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

//Earlier code

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'PENDING',
      citizen_id INTEGER NOT NULL REFERENCES users(id),
      worker_id INTEGER REFERENCES users(id),
      image_url TEXT,
      proof_image_url TEXT,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      captured_at TEXT,
      capture_latitude DOUBLE PRECISION,
      capture_longitude DOUBLE PRECISION,
      capture_accuracy DOUBLE PRECISION,
      risk_score INTEGER DEFAULT 0,
      risk_level TEXT DEFAULT 'LOW',
      risk_reason TEXT,
      moderation_status TEXT DEFAULT 'AUTO_APPROVED',
      duplicate_count INTEGER NOT NULL DEFAULT 0
    );

    ALTER TABLE complaints
    ADD COLUMN IF NOT EXISTS duplicate_count INTEGER NOT NULL DEFAULT 0;

    ALTER TABLE complaints
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
  `);

  console.log("PostgreSQL database initialized");
};

export default pool;
