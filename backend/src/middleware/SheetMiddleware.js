import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";
import SheetModel from "../model/SheetModel.js";
import requestAddParams from "../common/tools/requestAddParams.js";

class SheetMiddleware {
    /**
     * To verify if connected user has permission to access a sheet.
     * Require Middleware sheetExists.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasPermissionToAccess(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken));
        let sheet = req.body.additionnalParameters.sheet;
        // if userId not in users who has access at this sheet
        if(!sheet.users.some((x) => Number(x.id)===userID)) {
            return res.status(401)
                    .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }
        return next();
    }

    /**
     * To verify if connected user has permission to delete a sheet.
     * Require Middleware sheetExists.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasOwnerPermission(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken));
        let sheet = req.body.additionnalParameters.sheet;
        // if userId not in users who has access with owner permission at this sheet
        if(!sheet.users.some((x) => Number(x.id)===userID && x.userAccessSheet.accessRight=='owner')) {
            return res.status(401)
                    .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }
        return next();
    }

    /**
     * To verify if a sheet exists.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async sheetExists(req, res, next) {
        let sheet=await SheetModel.getById(req.params.sheetId);
        if (sheet == null) {
            return res.status(404).send(Data.ANSWERS.ERRORS_404.NOT_EXIST);
        }
        requestAddParams(req, { sheet: sheet });
        return next();
    }

    /**
     * To verify if access granted is valid.
     * Require Middleware sheetExists.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasValidAccess(req, res, next) {
        if (req.params.access!==undefined && 
            (req.params.access != 'reader' && req.params.access != 'writer')) {
            return res.status(400)
                      .send(Data.ANSWERS.ERRORS_400.ACCESS_SHEET_INVALID);
        }
        return next();
    }

    /**
     * To verify if a user in parameter is not the one who is connected.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async isOtherUser(req, res, next) {
        let userIDConnected = await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken);
        let userIDParam = req.params.userId;
        if (userIDConnected == userIDParam) {
            return res.status(401).send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }
        return next();
    }
}


export default SheetMiddleware