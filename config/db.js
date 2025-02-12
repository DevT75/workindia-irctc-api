import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("Connected to Supabase PostgreSQL"))
    .catch(err => console.error("db connection failed:", err));

export default pool;