import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";

const sheetRouter = express.Router()
sheetRouter
    .get('/all', [
        AuthMiddleware.checkAuthToken,
        SheetController.getAccessibleByCurrentUser
    ])
    .get('/owned', [
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    .get('/:sheetId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermissionToAccess,
        SheetController.getById
    ])
    .post('/create', [
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])
    .delete('/:sheetId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        SheetController.deleteSheet
    ])
    .put('/addUser/:sheetId/:userId/:access?', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.isOtherUser,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        UserMiddleware.userExists,
        SheetMiddleware.hasValidAccess,
        SheetController.addUser
    ])
    .delete('/deleteUser/:sheetId/:userId', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.isOtherUser,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasOwnerPermission,
        UserMiddleware.userExists,
        SheetController.deleteUser
    ]);


export default sheetRouter;