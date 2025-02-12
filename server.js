import express from 'express'
import userRoutes from './routes/userRoutes.js'
import trainRoutes from './routes/trainRoutes.js'
import initDb from './models/init.js'
import dotenv from 'dotenv'

const app = express();
const port = process.env.PORT;
dotenv.config();
initDb();

app.use(express.json());

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/user', userRoutes);
app.use('/api/train', trainRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



// check train availibility (source -> dest)
// user->register, login
// logged in user : chekc availibility of trains, check seat availibility , book trains, check, get booking details
// admin: can add trains, update total seats

// endpoint for registering a user

// login user

// add a new train for admin

// get seat availibility : source and dest

// book a seat : source -> dest for a particular train

// return booking details