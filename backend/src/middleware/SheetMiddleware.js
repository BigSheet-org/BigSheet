import Data from "../common/data/Data.js";
import SheetModel from "../model/SheetModel.js";
import Params from "./Params.js";

class SheetMiddleware {
    /**
     * To verify if connected user has permission to access a sheet.
     * Require Middleware sheetExists.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasPermissionToAccess(req, res, next) {
        let addedParams = Params.getAddedParams(res);
        let userID = addedParams.connectedUserID;
        let sheet = addedParams.sheet;
        // If userId not in users who have access at this sheet
        if(!sheet.users.some((x) => x.id===userID)) {
            return res.status(401)
                      .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }

        return next();
    }

    /**
     * To verify if connected user has permission to delete a sheet.
     * Require Middleware sheetExists.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasOwnerPermission(req, res, next) {

        let addedParams = Params.getAddedParams(res);
        let userID = addedParams.connectedUserID;
        let sheet = addedParams.sheet;
        // If userId not in users who have access with owner permission at this sheet
        if(!sheet.users.some((x) => x.id === userID
            && x.UserAccessSheet.accessRight === Data.SERVER_COMPARISON_DATA.PERMISSIONS.OWNER)) {
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
        let sheet = await SheetModel.getById(Params.getRequestParams(res).sheetId);
        if (sheet === null) {
            return res.status(404)
                      .send(Data.ANSWERS.ERRORS_404.NOT_EXIST);
        }
        Params.addMiddlewareParams(res, { sheet: sheet });
        return next();
    }

    /**
     * To verify if access granted is valid.
     * Require Middleware sheetExists.
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasValidAccess(req, res, next) {
        if (Params.getRequestParams(res).access !== undefined &&
            (Params.getRequestParams(res).access !== 'reader' &&Params.getRequestParams(res).access !== 'writer')) {
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
        let connectedUserID= Params.getAddedParams(res).connectedUserID;
        let userIDParam = Number(Params.getRequestParams(res).userId);
        if (connectedUserID === userIDParam) {
            return res.status(401).send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }
        return next();
    }

    /**
     * This method checks if the body fields are present in the request for the modification.
     *
     * @param req request provided.
     * @param res response to send.
     * @param next next handler to call.
     * @returns {Promise<*>}
     */
    static async hasValidModificationFields(req, res, next) {
        let body =  Params.getRequestParams(res);
        // We check if there are at least some fields provided.
        if (!body.title && !body.detail) {
            return res.status(400)
                      .send(Data.ANSWERS.ERRORS_400.NO_FIELDS);
        }
        return next();
    }


    /**
     * This method checks if the body fields are present in the request for the creation of the sheet.
     *
     * @param req  request provided.
     * @param res  response to send.
     * @param next next handler to call.
     * @returns {Promise<*>}
     */
    static async hasValidCreationFields(req, res, next) {
        let body =  Params.getRequestParams(res);
        // We check if there are at least some fields provided.
        if (!body.title) {
            return res.status(400)
                .send(Data.ANSWERS.ERRORS_400.NO_FIELDS);
        }
        return next();
    }
}


export default SheetMiddleware;