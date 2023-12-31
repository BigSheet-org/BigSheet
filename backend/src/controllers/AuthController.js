import AuthMiddleware from "../middleware/AuthMiddleware.js";
import Tokens from "../common/tools/Tokens.js";
import UserModel from "../model/UserModel.js";
import Data from "../common/data/Data.js";
import Params from "../middleware/Params.js";

class AuthController {
    /**
     * Method to send the auth and refresh tokens of the user if the credentials are correct.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async login(req, res) {
        if (await AuthMiddleware.authenticate(Params.getRequestParams(res).login, Params.getRequestParams(res).password)) {
            // We find the user concerned by the login.
            let userConcerned = await UserModel.getUserByLogin(Params.getRequestParams(res).login);
            // We generate and send the tokens.
            return res.send(Tokens.generateTokens(userConcerned.id));
        } else {
            // We send an 401 auth code.
            return res.status(401)
                      .send(Data.ANSWERS.ERRORS_401.INVALID_CREDENTIALS);
        }
    }

    /**
     * Method that bans auth and refresh tokens for them to not be used anymore until they expire.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async logout(req, res) {
        // We need to ban the auth and refresh tokens.
        // We extract the data from the two tokens.
        let params = Params.getAddedParams(res);
        let auth_check = params.dataFromAuthToken;
        let refresh_check = params.dataFromRefreshToken;

        // We ban both tokens.
        await Tokens.banToken(Params.getRequestParams(res).access_token, auth_check);
        await Tokens.banToken(Params.getRequestParams(res).refresh_token, refresh_check);

        // If both operations have completed successfully, we send a confirmation message.
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER);
    }

    /**
     * Method that sends a new pair of tokens if the refresh_token provided is valid.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async refreshTokens(req, res) {
        // We extract the data from the old token.
        let data = Params.getAddedParams(res).dataFromRefreshToken;

        // We generate a new pair.
        let newTokens = Tokens.generateTokens(data.userID);
        await Tokens.banToken(Params.getRequestParams(res).refresh_token, data);                // We blacklist the older refresh token.

        // We send the new pair.
        return res.send(newTokens);
    }
}

export default AuthController;