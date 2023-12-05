"use strict"        // We activate strict mode.

import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import sequelize from "./common/tools/postgres.js";
import Params from "./common/tools/Params.js";

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
        optionsSuccessStatus: 200
    });

// -- Server configuration -- //
// Adding CORS.
app.use(corsMiddleware);
// Adding support for JSON data format.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -- Routes Import -- //
app.use(Params.exportParamsToResLocale);                // For all routes we export the params to facilitate their processing.

// Import the routes into the different paths.
// It searches all default module exports in the routes directory.
const files = fs.readdirSync('./src/routes/');
for (let i = 0; i < files.length; i++) {
    let file = files[i];
    const module = await import('./routes/' + file);
    app.use("/" + file.split('.')[0], module.default);
}
console.log(`[INFO] - Done mounting paths.`);

// -- Create or modify all tables in database if it's necessary -- //
await sequelize.sync({ alter: true });
console.log(`[INFO] - Done Initializing models.`);

// -- Association between the tables. -- //
const module = await import("./association/Associations.js")
await module.syncAssociations()

// -- Starting Server listener -- //
server.listen(port, () => console.log(`[INFO] - Server launched on port ${port}. Awaiting requests...`));