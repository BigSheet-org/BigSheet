import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";

const sheetRouter = express.Router()
sheetRouter
    /** Getter for all accessible sheets. Owned and invited to. */
    .get('/all', [
        AuthMiddleware.checkAuthToken,
        SheetController.getAccessibleByCurrentUser
    ])
    /** Getter for owned sheets. */
    .get('/owned', [
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    /** Getter for shared sheets. */
    .get('/shared', [
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    /** Getter for a specific sheet. */
    .get('/:sheetId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermissionToAccess,
        SheetController.getById
    ])

    /** Method to create a new sheet. */
    .post('/create', [
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])

    /** Method to add a new user to the sheet's participants. */
    .put('/addUser/:sheetId/:userId/:access?', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.isOtherUser,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        UserMiddleware.userExists,
        SheetMiddleware.hasValidAccess,
        SheetController.addUser
    ])

    /** Method to delete a specific sheet. */
    .delete('/:sheetId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        SheetController.deleteSheet
    ])
    /** Method to delete a specific user's permission. */
    .delete('/user/:sheetId/:userId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.isOtherUser,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        UserMiddleware.userExists,
        SheetController.deleteUser
    ]);

export default sheetRouter;