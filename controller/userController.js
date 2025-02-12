import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import pool from '../config/db.js';
// import User from '../models/user.js'

export const registerUser = async (req, res) => {

    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash( password, 10);

    var roleOfUser = role;

    if(role){
        roleOfUser = role == "admin" ? "user" : role;
    }

    try {
        const query = `INSERT INTO users (name, email, password, role) VALUES ( $1, $2, $3, $4 )`;
        await pool.query(query, [name, email, hashedPassword, roleOfUser]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if(error.code == "23505") res.status(400).json({"message":"Email already exists!!"});
        console.log(error);
        res.status(500).json({ message: "Error registering user" });
    }

}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await pool.query(query, [email]);
        if (rows.length === 0) return res.status(401).json({ message: "Invalid email" });

        const user = rows[0];
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }

}
