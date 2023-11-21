import SheetModel from "../model/SheetModel.js";
import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";

class SheetController {
    /**
     * This method will ask the model to get all sheets owned by connected user.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getOwnedByCurrentUser(req, res) {
        // We extract the current user ID from the token.
        let userID = await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req));
        let sheets = await SheetModel.getAllSheetsByOwner(userID);
        return res.send(sheets);
    }

    /**
     * This method will create a sheet.
     *
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async createSheet(req, res) {
        // get user connected
        let userID = await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req));
        let sheet = await SheetModel.create({ownerId: userID});
        await sheet.save();
        return res.send(sheet);
    }

    /**
     * This method will remove a sheet.
     * Require Middleware sheetExists.
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async deleteSheet(req, res) {
        let sheet = await SheetModel.getById(req.params.id);        
        await sheet.destroy();
        await sheet.save();
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER);
    }

    /**
     * This method will ask the model to get sheet with the good id.
     * Require Middleware sheetExists.
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getById(req, res) {
        return res.send(req.body.additionnalParameters.sheet);
    }
}

export default SheetController;
