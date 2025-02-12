import createUserTable from "./user.js";
import createTrainTable from "./train.js";
import createBookingTable from "./booking.js";
import pool from "../config/db.js";

export const createIndexes = async () => {
    try {
        await pool.query("CREATE INDEX IF NOT EXISTS idx_trains_route ON trains (source, destination);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_trains_availability ON trains (available_seats);");
        console.log("indexes created successfully.");
    } catch (err) {
        console.error("error creating indexes:", err);
    }
};

const initDb = async () =>{
    await createUserTable();
    await createTrainTable();
    await createBookingTable();
    await createIndexes();
    console.log("db initialized successfully!!");
}

export default initDb;