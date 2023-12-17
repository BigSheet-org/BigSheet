import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";
import Params from "../middleware/Params.js";

const sheetRouter = express.Router()
sheetRouter
    /** Getter for all accessible sheets. Owned and invited to. */
    .get('/all', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetController.getAccessibleByCurrentUser
    ])
    /** Getter for owned sheets. */
    .get('/owned', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    /** Getter for shared sheets. */
    .get('/shared', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetController.getSharedToCurrentUser
    ])
    /** Getter for a specific sheet. */
    .get('/:sheetId', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermissionToAccess,
        SheetController.getById
    ])

    /** Method to create a new sheet. */
    .post('/create', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])

    /** Method to add a new user to the sheet's participants. */
    .put('/addUser/:sheetId/:userId/:access?', [
        Params.exportParamsToResLocale,
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
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        SheetController.deleteSheet
    ])
    /** Method to delete a specific user's permission. */
    .delete('/user/:sheetId/:userId', [
        Params.exportParamsToResLocale,
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.isOtherUser,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        UserMiddleware.userExists,
        SheetController.deleteUser
    ]);
    
export default sheetRouter;