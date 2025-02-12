import pool from "../config/db.js";

export const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user'
        );
    `;
    try {
        await pool.query(query);
        console.log("User Table Created!!");
    } catch (err) {
        console.error("error creating users table:", err);
    }
};

export default createUserTable;
