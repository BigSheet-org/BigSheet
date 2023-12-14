import express from "express";
import sequelize from "../common/tools/postgres.js";
import Data from "../common/data/Data.js";
import TestController from "../controllers/TestController.js";

const testRouter = express.Router()

testRouter
    /** Route to test the connexion with the postgres Database. */
    .get('/postgres_db', [
        TestController.testPostgresConnextion
    ])
    /** Route to test the connexion with the redis Database. */
    .get('/redis_db', [
        TestController.testRedisConnexion
    ]);


export default testRouter;