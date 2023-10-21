import express from "express";
import { createServer } from "http";
import tests from "./routes/tests.js"
import main from "./routes/main.js"
import dotenv from "dotenv";

dotenv.config()

// app est la fonction de rappel créée par Express
const app = express();
const server = createServer(app);
const port = process.env.NODE_SERVER_PORT;
server.listen(port, () => console.log(`[INFO] - Server launched on port ${port}`));



// -- Routes Import -- //
// Import my test routes into the path '/test'
app.use('/', main)
app.use('/tests', tests);
