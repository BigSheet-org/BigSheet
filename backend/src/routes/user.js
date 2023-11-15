import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../common/middleware/AuthMiddleware.js";

const userRouter = express.Router()
userRouter
    /**
     * Personnal getter for the logged in user.
     */
    .get('/me', [
        AuthMiddleware.checkAuthToken,
        UserController.getCurrentUser
    ])
    .get('/:id', [
        AuthMiddleware.checkAuthToken,
        UserController.getById
    ])
    .post('/register', (req, res) => {

    })


export default userRouter