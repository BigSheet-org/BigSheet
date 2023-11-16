import express from "express";
import sequelize from "../common/tools/postgres.js";
import Data from "../common/data/Data.js";

const testRouter = express.Router()
testRouter
    .get('/postgres_db', async (req, res) => {
        let message
        try {
            await sequelize.authenticate()      // We try the connexion with the database.
            message = '[INFO] - Connection to database has been established successfully.';
        } catch(error) {
            message = '[ERROR] - Connection to database failed !\n' + 'Error : ' + error;
        }
        res.send({
            "message": message
        })
    })

    .get('/server', (req, res) => {
        res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER)
    })


export default testRouter