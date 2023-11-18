"use strict"        // We activate strict mode.

import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";

// -- Routes import -- //
import tests from "./src/routes/tests.js";
import main from "./src/routes/main.js";
import auth from "./src/routes/auth.js";
import user from "./src/routes/user.js";

// -- Models import -- //
import UserModel from "./src/model/UserModel.js";

dotenv.config();

// A list of accepted origins.
const origins = [
    "http://localhost:5173",
    "https://localhost:5173"
];
const app = express();
const server = createServer(app);
const port = process.env.NODE_SERVER_PORT;
const corsMiddleware = cors(
    {
        origin: origins,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        preflightContinue: false,
        optionsSuccessStatus: 200,
    });

// -- Server configuration -- //
// Adding CORS.
app.use(corsMiddleware);
// Adding support for JSON data format.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -- Routes Import -- //
// Import my routes into the different paths.
app.use('/', main);
app.use('/tests', tests);
app.use('/auth', auth);
app.use('/users', user);
console.log(`[INFO] - Done mounting paths.`);

// -- Models import -- //
await UserModel.sync({ alter: true });           // We allow the insertion of new columns.
console.log(`[INFO] - Done Initializing models.`);

// -- Starting Server listener -- //
server.listen(port, () => console.log(`[INFO] - Server launched on port ${port}. Awaiting requests...`));



