import express from "express";
import User from "../model/user.js";

const userRouter = express.Router()
userRouter
    /**
     * Personnal getter for the logged in user.
     */
    .get('/me', (req, res) => {
        let currentUser = User.get()
    })
    .post('/register', (req, res) => {

    })


export default userRouter