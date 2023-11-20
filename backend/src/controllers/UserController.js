import UserModel from "../model/UserModel.js";
import Tokens from "../common/tools/Tokens.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import Data from "../common/data/Data.js";

class UserController {
    /**
     * This method will ask the model to get the user qualified by the id.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getById(req, res) {
        let user = await UserModel.getById(req.params.id);
        if (user === null) {
            return res.status(404)
                .send({"message" : `User with id ${req.params.id} does not exists.`});
        } else {
            return res.send(user);
        }
    }

    /**
     * This method will ask the model to get the connected user.
     *
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getCurrentUser(req, res) {
        // We extract the current user ID from the token.
        let userID = await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req));
        //
        let user = await UserModel.getById(userID);
        if (user === null) {
            return res.status(404)
                .send({"message": `User with ${userID} ID does not exists.`});
        }
        // We send the user.
        return res.send(user);
    }

    /**
     * This method will create a new user.
     *
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async createUser(req, res) {
        let body = req.body;
        body.hash = await AuthMiddleware.hashPassword(body.password);
        body.password = undefined;
        body.confirmPassword = undefined;

        let user = await UserModel.create(body);
        await user.save();
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER);
    }

    /**
     * This method deletes the user with the id provided.
     *
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async deleteUser(req, res){
        let userToDelete = await UserModel.getById(req.params.id)
        await userToDelete.destroy()
        await userToDelete.save()
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER)
    }

    /**
     * This method will modify the user with the id present in the token.
     *
     * @param req Request provided. Contains the parameters required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async modifyUser(req, res) {
        let body = req.body;
        let userToChange = await UserModel.getById(
            await Tokens.getUserIdFromToken(Tokens.getAuthTokenFromHeader(req))
        );

        // We check the fields of the body, and we apply the necessary modifications.
        if (body.password)  { userToChange.hash = AuthMiddleware.hashPassword(body.password); }
        if (body.login)     { userToChange.login = body.login; }
        if (body.mail)      { userToChange.mail = body.mail; }
        if (body.firstname) { userToChange.firstname = body.firstname; }
        if (body.lastname)  { userToChange.lastname = body.lastname; }

        await userToChange.save();
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER);
    }
}

export default UserController
