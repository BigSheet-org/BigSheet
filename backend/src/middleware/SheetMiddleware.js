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
        let usersAccess = sheet.users.map((x) => Number(x.id));
        if(!usersAccess.includes(userID)) {
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