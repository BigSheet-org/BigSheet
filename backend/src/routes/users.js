import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";

const userRouter = express.Router()
userRouter
    /** Personal getter for the logged in user. */
    .get('/me', [
        AuthMiddleware.checkAuthToken,
        UserController.getCurrentUser
    ])
    /** Getter using a userID. */
    .get('/:userId', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.userExists,
        UserController.getById
    ])
    /** Getter used to search a user by its login. */
    .get('/search', [
        AuthMiddleware.checkAuthToken,
    ])

    /** Method to register a new User. */
    .post('/register', [
        UserMiddleware.hasValidRegisterFields,
        UserController.createUser
    ])

    /** Method to modify an existing user. */
    .patch('/modify', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidModificationFields,
        UserController.modifyUser
    ])

    /** Method to delete a user by its id. */
    .delete('/:userId', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidDeletionParams,
        UserMiddleware.hasPermissionToDelete,
        UserController.deleteUser
    ]);


export default userRouter;