import express from "express";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

const authRouter = express.Router();
authRouter
    .post('/login', (req, res) => {

    })

    .post('/logout', (req, res) => {

    })

export default authRouter