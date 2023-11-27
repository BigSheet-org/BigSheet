import SheetModel from "../model/SheetModel.js";
import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";

class SheetController {
    /**
     * This method will ask the model to get all sheets owned by connected user.
     * Require checkAuthToken
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getOwnedByCurrentUser(req, res) {
        // We extract the current user ID from the token.
        let userID = await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken);
        let sheets = await SheetModel.getAllByOwner(userID);
        return res.send(sheets);
    }

    /**
     * This method will ask the model to get all sheets accessible by connected user.
     * Require checkAuthToken
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getAccessibleByCurrentUser(req, res) {
        // We extract the current user ID from the token.
        let userID = await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken);
        let sheets = await SheetModel.getAccessibleByUser(userID);
        return res.send(sheets);
    }

    /**
     * This method will create a sheet.
     * Require checkAuthToken
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async createSheet(req, res) {
        // get user connected
        let userID = await Tokens.getUserIdFromToken(req.body.additionnalParameters.authToken);
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
        let sheet = req.body.additionnalParameters.sheet;        
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
