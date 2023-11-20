import express from "express";
import SheetController from "../controllers/SheetController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import SheetMiddleware from "../middleware/SheetMiddleware.js";
import UserMiddleware from "../middleware/UserMiddleware.js";

const sheetRouter = express.Router()
sheetRouter
    .get('/all', [
        AuthMiddleware.checkAuthToken,
        SheetController.getOwnedByCurrentUser
    ])
    .get('/getOwned/:id', [
        AuthMiddleware.checkAuthToken,
        UserMiddleware.userExist,
        SheetController.getOwnedByUserId
    ])
    .post('/create', [
        AuthMiddleware.checkAuthToken,
        SheetController.createSheet
    ])
    .delete('/delete/:id', [
        AuthMiddleware.checkAuthToken,
        SheetMiddleware.hasPermissionToDelete,
        SheetController.deleteSheet
    ]);


export default sheetRouter;