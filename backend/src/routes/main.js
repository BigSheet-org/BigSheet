import express from "express";
import TestController from "../controllers/TestController.js";


const mainRouter = express.Router()

mainRouter
    /** The main server path. Mainly used to test the server's connexion. */
    .get('/', [
        TestController.testServer
    ]);

export default mainRouter;