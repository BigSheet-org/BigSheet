import AuthMiddleware from "../common/middleware/AuthMiddleware.js";
import Tokens from "../common/tools/Tokens.js";
import UserModel from "../model/UserModel.js";
import Data from "../common/data/Data.js";

class AuthController {
    /**
     * Method tho send the auth and refresh tokens of the user if the credentials are correct.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async login(req, res) {
        if (await AuthMiddleware.authenticate(req.body.login, req.body.password)) {
            // We find the user concerned by the login.
            let userConcerned = await UserModel.getUserByLogin(req.body.login)
            // We generate and send the tokens.
            return res.send(Tokens.generateTokens(userConcerned.id))
        } else {
            // We send an 401 auth code.
            return res.status(401)
                      .send(Data.ANSWERS.ERRORS_401.INVALID_CREDENTIALS)
        }
    }

    static async logout(req, res) {
        // We need to ban the auth and refresh tokens.
        await Tokens.banToken(req.body.access_token, Tokens.verifyAuthToken(req.body.access_token))
        await Tokens.banToken(req.body.refresh_token, Tokens.verifyAuthToken(req.body.refresh_token))
        // If both operations have completed successfully, we send a confirmation message.
        return res.send(Data.ANSWERS.DEFAULT.DEFAULT_OK_ANSWER)
    }

    static async refreshTokens(req, res) {
        // We extract the data from the old token.
        let data = Tokens.verifyRefreshTokens(req.body.refresh_token)
        // We generate a new pair.
        let newTokens = Tokens.generateTokens(data.userID)
        // We blacklist the older refresh token.
        await Tokens.banToken(req.body.refresh_token, data)
        // We send the new pair.
        return res.send(newTokens)
    }
}

export default AuthController