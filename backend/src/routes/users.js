import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";

const userRouter = express.Router()
userRouter
    /**
     * Personnal getter for the logged in user.
     */
    .get('/me', [
        AuthMiddleware.checkAuthToken,
        UserController.getCurrentUser
    ])
    .get('/:userId', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.userExists,
        UserController.getById
    ])
    .post('/register', [
        UserMiddleware.hasValidRegisterFields,
        UserController.createUser
    ])
    .patch('/modify', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidModificationFields,
        UserController.modifyUser
    ])
    .delete('/:userId', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.hasValidDeletionParams,
        UserMiddleware.hasPermissionToDelete,
        UserController.deleteUser
    ]);


export default userRouter;