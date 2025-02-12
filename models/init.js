import createUserTable from "./user.js";
import createTrainTable from "./train.js";
import createBookingTable from "./booking.js";

const initDb = async () =>{
    await createUserTable();
    await createTrainTable();
    await createBookingTable();

    console.log("db initialized successfully!!");
}

export default initDb;