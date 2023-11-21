import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";

const sheetRouter = express.Router()
sheetRouter
    .get('/all', [
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    .get('/:id', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermission,
        SheetController.getById
    ])
    .post('/create', [
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])
    .delete('/delete/:id', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.sheetExists,
        SheetMiddleware.hasPermission,
        SheetController.deleteSheet
    ]);


export default sheetRouter;