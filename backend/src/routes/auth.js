import express from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import Params from "../middleware/Params.js";

const authRouter = express.Router();
authRouter
    /** Route for the login of the user.*/
    .post('/login', [
        Params.exportParamsToResLocale,
        AuthMiddleware.hasValidLoginFields,
        AuthController.login
    ])
    /** Route for the logout of the user.*/
    .post('/logout', [
        Params.exportParamsToResLocale,
        AuthMiddleware.hasValidLogoutFields,
        AuthMiddleware.checkRefreshToken,
        AuthMiddleware.checkAuthToken,
        AuthController.logout
    ])
    /** Route for the refresh operation of the tokens.*/
    .post('/refresh', [
        Params.exportParamsToResLocale,
        AuthMiddleware.hasValidRefreshFields,
        AuthMiddleware.checkRefreshToken,
        AuthController.refreshTokens
    ]);

export default authRouter;