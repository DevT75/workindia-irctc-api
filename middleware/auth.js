import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        req.user = null;
        return next();
    }

    // const t = token.split(' ')[1];

    jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        }
        else {
            req.user = user;
        }
        next();
    });
}

export const verifyAdmin = (req, res, next) => {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ message: "Invalid or missing Admin API key" });
    }

    next();
}