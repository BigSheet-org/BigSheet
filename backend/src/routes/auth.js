import express from "express";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

const authRouter = express.Router();
authRouter
    .post('/login', async (req, res) => {
        let body = req.body
        console.log(body)
        res.send({
            message: {
                body
            },
        })
    })

    .post('/logout', (req, res) => {

    })

    .post('/refresh', (req, res) => {

    })

export default authRouter