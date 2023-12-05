import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";
import Params from "../middleware/Params.js";

const userRouter = express.Router()
userRouter
    /** Personal getter for the logged in user. */
    .get('/me', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        UserController.getCurrentUser
    ])
    /** Getter using a userID. */
    .get('/:userId', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        UserMiddleware.userExists,
        UserController.getById
    ])
    /** Getter used to search a user by its login. */
    .get('/search/:query', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
    ])

    /** Method to register a new User. */
    .post('/register', [
        Params.exportParamsToResLocale,
        UserMiddleware.hasValidRegisterFields,
        UserController.createUser
    ])

    /** Method to modify an existing user. */
    .patch('/modify', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidModificationFields,
        UserController.modifyUser
    ])

    /** Method to delete a user by its id. */
    .delete('/:userId', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidDeletionParams,
        UserMiddleware.hasPermissionToDelete,
        UserController.deleteUser
    ]);


export default userRouter;