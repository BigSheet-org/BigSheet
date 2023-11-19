import SheetModel from "../model/SheetModel.js";
import Data from "../common/data/Data.js";
import UserModel from "../model/UserModel.js";
import Tokens from "../common/tools/Tokens.js";

class UserController {
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
     * This method will ask the model to get all sheets owned by user with the good id.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
     static async getOwnedByUserId(req, res) {
        let sheets = await SheetModel.getAllSheetsByOwner(req.params.id);
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
        let user = await UserModel.getById(userID);
        let sheet = await SheetModel.create({ownerId: userID});
        await sheet.save();
        return res.send(sheet);
    }

    static async deleteUser(req, res){
        let userToDelete = await UserModel.getById(req.params.id)
        await userToDelete.destroy()
        await userToDelete.save()
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER)
    }
}

export default UserController
