import express from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const authRouter = express.Router();
authRouter
    /** Route for the login of the user.*/
    .post('/login', [
        AuthMiddleware.hasValidLoginFields,
        AuthController.login
    ])
    /** Route for the logout of the user.*/
    .post('/logout', [
        AuthMiddleware.hasValidLogoutFields,
        AuthMiddleware.checkRefreshToken,
        AuthMiddleware.checkAuthToken,
        AuthController.logout
    ])
    /** Route for the refresh operation of the tokens.*/
    .post('/refresh', [
        AuthMiddleware.hasValidRefreshFields,
        AuthMiddleware.checkRefreshToken,
        AuthController.refreshTokens
    ]);

export default authRouter;