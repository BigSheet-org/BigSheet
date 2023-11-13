import express from "express";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

const authRouter = express.Router();
authRouter
    .post('/login', async (req, res) => {
        let body = req.body
        if (body.login !== undefined && body.password !== undefined) {
            console.log("[DEBUG] - Got a valid login request !")
            console.log("[DEBUG] - login : " + body.login)
            console.log("[DEBUG] - password : " + body.password)
        } else {
            res.status(401)
                .send({ detail: "Login or password was not provided." })
        }

    })

    .post('/logout', (req, res) => {

    })

    .post('/refresh', (req, res) => {

    })

export default authRouter