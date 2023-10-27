import express from "express";
import sequelize from "../model/user.js";

const testRouter = express.Router()
testRouter
    .get('/postgres_db', async (req, res) => {
        let message = ''
        try {
            await sequelize.authenticate()
            message = '[INFO] -Connection has been established successfully.';
        } catch(error) {
            message = '[ERROR] - Connection to database failed !\n' + 'Error : ' + error;
        }
        res.send({
            "message": message
        })
    })

    .get('/', (req, res) => {
        res.send({
            "message": "ok"
        })
    })


export default testRouter