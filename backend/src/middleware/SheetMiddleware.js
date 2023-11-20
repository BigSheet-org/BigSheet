import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";
import SheetModel from "../model/SheetModel.js";

class SheetMiddleware {
    static async hasPermissionToDelete(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req)));
        let sheet = await SheetModel.getById(req.params.id);
        // if sheet not exist 404 error
        if (sheet!=null) {
            console.log(sheet);
            let ownerIDSheetToDelete = Number(sheet.ownerId);
            if(userID != ownerIDSheetToDelete) {
                return res.status(401)
                        .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS);
            }
        } else return res.status(404).send(Data.ANSWERS.ERRORS_404.NOT_EXIST);
        return next();
    }
}


export default SheetMiddleware