import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";
import SheetModel from "../model/SheetModel.js";
import requestAddParams from "../common/tools/requestAddParams.js";

class SheetMiddleware {
    /**
     * To verify if connected user has permission to delete a sheet.
     * Require Middleware sheetExists.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async hasPermission(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req)));
        let sheet = req.body.additionnalParameters.sheet;
        let ownerIDSheetToDelete = Number(sheet.ownerId);
        if(userID != ownerIDSheetToDelete) {
            return res.status(401)
                    .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
        }
        return next();
    }

    static async sheetExists(req, res, next) {
        let sheet=await SheetModel.getById(req.params.id);
        if (sheet == null) {
            return res.status(404).send(Data.ANSWERS.ERRORS_404.NOT_EXIST);
        }
        requestAddParams(req, { sheet: sheet });
        return next();
    }
}


export default SheetMiddleware