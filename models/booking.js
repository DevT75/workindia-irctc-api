import pool from "../config/db.js";

export const createBookingTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            train_id INT REFERENCES trains(id) ON DELETE CASCADE,
            seat_number INT NOT NULL
        );
    `;
    try {
        await pool.query(query);
        console.log("Bookings table created");
    } catch (err) {
        console.error("error creating bookings table:", err);
    }
};

export default createBookingTable;
