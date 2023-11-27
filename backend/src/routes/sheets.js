import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";

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
    .get('/:id', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermissionToAccess,
        SheetController.getById
    ])
    .post('/create', [
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])
    .delete('/:id', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermissionToAccess,
        SheetController.deleteSheet
    ]);


export default sheetRouter;