// import db from '../config/db'

// export const createTrainTable = () =>{
//     const query = `
//         CREATE TABLE trains (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(100) NOT NULL,
//             source VARCHAR(100) NOT NULL,
//             destination VARCHAR(100) NOT NULL,
//             total_seats INT NOT NULL,
//             available_seats INT NOT NULL
//         );
//     `;

//     db.query(query, (err) => {
//         if(err) throw err;
//         console.log("Train table created!!");
//     });
// }

import pool from "../config/db.js";

export const createTrainTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS trains (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            source VARCHAR(100) NOT NULL,
            destination VARCHAR(100) NOT NULL,
            total_seats INT NOT NULL,
            available_seats INT NOT NULL
        );
    `;
    try {
        await pool.query(query);
        console.log("Train table created!!");
    } catch (err) {
        console.error("error creating trains table:", err);
    }
};

export default createTrainTable;
