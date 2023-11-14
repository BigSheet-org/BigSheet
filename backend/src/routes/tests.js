import express from "express";
import sequelize from "../common/tools/postgres.js";

const testRouter = express.Router()
testRouter
    .get('/postgres_db', async (req, res) => {
        let message = ''
        try {
            await sequelize.authenticate()      // We try the connexion with the database.
            message = '[INFO] - Connection has been established successfully.';
        } catch(error) {
            message = '[ERROR] - Connection to database failed !\n' + 'Error : ' + error;
        }
        res.send({
            "message": message
        })
    })

    .get('/server', (req, res) => {
        res.send({
            "message": "ok"
        })
    })


export default testRouter