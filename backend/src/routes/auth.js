import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();
authRouter
    /** Route for the login of the user.*/
    .post('/login', [
        AuthController.login
    ])
    /** Route for the logout of the user.*/
    .post('/logout', (req, res) => {

    })
    /** Route for the refresh operation of the tokens.*/
    .post('/refresh', (req, res) => {

    })

export default authRouter