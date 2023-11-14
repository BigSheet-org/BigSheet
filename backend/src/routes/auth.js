import express from "express";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../model/UserModel.js";
import {Op} from "sequelize";

const authRouter = express.Router();
authRouter
    .post('/login', async (req, res) => {
        if (req.body.login !== undefined && req.body.password !== undefined) {
            let user = await UserModel.findAll({
                where: { login: {
                            [Op.eq]: req.body.login
                    }}
            });
            if (user.length === 0){
                res.status(404)
                    .send({ detail: "UserModel with login " + req.body.login + "  does not exists."})
            } else {

            }
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