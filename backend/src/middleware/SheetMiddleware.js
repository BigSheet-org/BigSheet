import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";
import SheetModel from "../model/SheetModel.js";

class SheetMiddleware {
    static async hasPermissionToDelete(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req)));
        let sheet = await SheetModel.getById(req.params.id)
        let ownerIDSheetToDelete = Number(sheet.owner);

        if(userID !== ownerIDSheetToDelete) {
            return res.status(401)
                      .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS)
        }
        return next();

    }
}


export default SheetMiddleware