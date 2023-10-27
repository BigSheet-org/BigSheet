import express from "express";
import { createServer } from "http";
import tests from "./routes/tests.js"
import main from "./routes/main.js"
import auth from "./routes/auth.js"
import dotenv from "dotenv";
import User from "./model/user.js";

// We import the .env file.
dotenv.config()

const app = express();
const server = createServer(app);
const port = process.env.NODE_SERVER_PORT;

// -- Routes Import -- //
// Import my routes into the different paths.
app.use('/', main)
app.use('/tests', tests);
app.use('/auth', auth);
console.log(`[INFO] - Done mounting paths.`);


// -- Models import -- //
await User.sync({
    alter: true         // Here we allow for modification inside the table if the model itself is changed. Won't delete already existing data.
})
console.log(`[INFO] - Done Initializing models.`);

// -- Starting Server listener -- //
server.listen(port, () => console.log(`[INFO] - Server launched on port ${port}. Awaiting requests...`));



