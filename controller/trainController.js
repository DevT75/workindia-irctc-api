import pool from "../config/db.js";

export const addTrain = async(req, res) =>{
    const { name, source, destination, total_seats } = req.body;

    try {
        const query = `INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4)`;
        await pool.query(query, [name, source, destination, total_seats]);
        res.status(200).json({ "message" : "train added successfully!!" });
    } catch (error) {
        res.status(500).json({ "message": "error adding train!!" });
    }
}

export const updateTrainDetails = async(req, res)=>{
    const { trainId } = req.params;
    const { total_seats } = req.body;

    if(total_seats < 1)
        return res.status(400).json({ "message" : "Total seats must be greater than 0" });

    try {
        
    } catch (error) {
        
    }

}

export const getTrains = async (req, res) =>{
    const { source, destination } = req.query;
    console.log({
        source : source,
        dest: destination
    })
    try {
        var q;
        if(req.user){
            q = `SELECT id, name, source, destination, available_seats FROM trains WHERE source = $1 AND destination = $2`;
        }
        else q = `SELECT id, name, source, destination FROM trains WHERE source = $1 AND destination = $2`;
        const results = await pool.query(q, [source, destination]);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(500).json({ "message" : "No trains found!!" });
    }
}

export const bookTrain = async (req, res) =>{
    const { trainId } = req.params;
    const userId = req.user.id;
    try {
        const q = `UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1 AND available_seats > 0 RETURNING id`;

        const { rowCount } = await pool.query(q, [trainId]);

        if(rowCount === 0){
            return res.status(400).json({ "message" : "No available seats!!" });
        }

        const bq = `INSERT INTO bookings ( user_id, train_id, seat_number ) VALUES ( $1, $2, (SELECT total_seats - available_seats FROM trains WHERE id = $2))`;
        await pool.query(bq, [userId, trainId]);
        res.status(200).json({ "message" : "Seat booked successfully!!" });

    } catch (error) {
        res.status(400).json({ "message" : "Error booking seats!!"} );
    }
}

export const getUserBookings = async (req, res) =>{
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

        if(rows.length === 0) return res.status(404).json({"message" : "No bookings found!!"});

        res.json(rows);
    } catch (error) {
        res.status(500).json({"mesasge": "error fetching booking details!!"});
    }
}