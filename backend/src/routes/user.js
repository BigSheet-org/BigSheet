import express from "express";
import UserController from "../controllers/UserController.js";

const userRouter = express.Router()
userRouter
    /**
     * Personnal getter for the logged in user.
     */
    .get('/me', [
        UserController.getCurrentUser
    ])
    .get('/:id', [
        UserController.getById
    ])
    .post('/register', (req, res) => {

    })


export default userRouter