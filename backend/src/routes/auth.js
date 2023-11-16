import express from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../common/middleware/AuthMiddleware.js";

const authRouter = express.Router();
authRouter
    /** Route for the login of the user.*/
    .post('/login', [
        AuthController.login
    ])
    /** Route for the logout of the user.*/
    .post('/logout', [

    ])
    /** Route for the refresh operation of the tokens.*/
    .post('/refresh', [
        AuthMiddleware.checkRefreshToken,
        AuthController.refreshTokens
    ])

export default authRouter