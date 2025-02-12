import pool from "../config/db.js";

export const addTrain = async (req, res) => {
    const { name, source, destination, total_seats } = req.body;

    try {
        const query = `INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4)`;
        await pool.query(query, [name, source, destination, total_seats]);
        res.status(200).json({ "message": "train added successfully!!" });
    } catch (error) {
        res.status(500).json({ "message": "error adding train!!" });
    }
}

export const updateTrainDetails = async (req, res) => {
    const { trainId } = req.params;
    const { total_seats } = req.body;

    if (total_seats < 1)
        return res.status(400).json({ "message": "Total seats must be greater than 0" });

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const q = `SELECT total_seats, available_seats FROM trains WHERE id = $1 FOR UPDATE`;

        const { rows } = await pool.query(q, [trainId]);

        if (rows.length === 0){
            await client.query("ROLLBACK");
            return res.status(404).json({ "message": "train not found!!" });
        }

        const { total_seats: oldTotalSeats, available_seats: oldAvailableSeats } = rows[0];

        const newAvailableSeats = oldAvailableSeats + (total_seats - oldTotalSeats);

        const uq = `UPDATE trains SET available_seats = $1, total_seats = $2 WHERE id = $3`;

        await pool.query(uq, [newAvailableSeats, total_seats, trainId]);

        await client.query("COMMIT");

        res.status(200).json({ "message": "details updated successfully!!", total_seats, available_seats: newAvailableSeats });

    } catch (error) {
        await client.query("ROLLBACK");
        res.status(403).json({ "message": "error updating details!!" });
    }
    finally{
        client.release();
    }

}

export const getTrains = async (req, res) => {
    const { source, destination } = req.query;
    console.log({
        source: source,
        dest: destination
    })
    try {
        var q;
        if (req.user) {
            q = `SELECT id, name, source, destination, available_seats FROM trains WHERE source = $1 AND destination = $2`;
        }
        else q = `SELECT id, name, source, destination FROM trains WHERE source = $1 AND destination = $2`;
        const results = await pool.query(q, [source, destination]);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(500).json({ "message": "No trains found!!" });
    }
}

export const bookTrain = async (req, res) => {
    const { trainId } = req.params;
    const userId = req.user.id;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const lq = `SELECT total_seats, available_seats FROM trains WHERE id = $1 FOR UPDATE`;

        const { rows } = await client.query(lq, [trainId]);

        if (rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "train not found!!" });
        }

        const { total_seats, available_seats } = rows[0];

        if (available_seats < 1) {
            await client.query("ROLLBACK");
            return res.status(400).json({ "message": "No available seats!!" });
        }

        const seat = total_seats - available_seats + 1;

        const q = `INSERT INTO bookings (user_id, train_id, seat_number) VALUES ($1, $2, $3)`;

        await client.query(q, [userId, trainId, seat]);

        const uq = `UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1`;

        await client.query(uq, [trainId]);

        await client.query("COMMIT");

        res.status(200).json({ "message": "Seat booked successfully", trainId, seat });

        // const q = `UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1 AND available_seats > 0 RETURNING id`;

        // const { rowCount } = await pool.query(q, [trainId]);

        // if (rowCount === 0) {
        //     return res.status(400).json({ "message": "No available seats!!" });
        // }

        // const bq = `INSERT INTO bookings ( user_id, train_id, seat_number ) VALUES ( $1, $2, (SELECT total_seats - available_seats FROM trains WHERE id = $2))`;
        // await pool.query(bq, [userId, trainId]);
        // res.status(200).json({ "message": "Seat booked successfully!!" });

    } catch (error) {
        await client.query("ROLLBACK");
        res.status(400).json({ "message": "Error booking seats!!" });
    }
    finally {
        client.release();
    }
}

export const getUserBookings = async (req, res) => {
    const userId = req.user.id;

    try {
        const q = `
            SELECT b.id AS booking_id, t.name AS train_name, t.source, t.destination, b.seat_number
            FROM bookings b
            INNER JOIN trains t ON b.train_id = t.id
            WHERE b.user_id = $1
            ORDER BY b.id DESC
        `

        const { rows } = await pool.query(q, [userId]);

        if (rows.length === 0) return res.status(404).json({ "message": "No bookings found!!" });

        res.json(rows);
    } catch (error) {
        res.status(500).json({ "mesasge": "error fetching booking details!!" });
    }
}