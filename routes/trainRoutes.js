import { getTrains, addTrain, bookTrain, getUserBookings } from "../controller/trainController.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";
import express from 'express'


const router = express.Router();

router.post('/add', verifyAdmin, addTrain);
router.get('/availability', verifyToken ,getTrains);
router.post('/book/:trainId', verifyToken, bookTrain);
router.get('/bookings', verifyToken, getUserBookings);

export default router;