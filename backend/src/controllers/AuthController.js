import AuthMiddleware from "../common/middleware/AuthMiddleware.js";
import Tokens from "../common/tools/Tokens.js";
import UserModel from "../model/UserModel.js";

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
                      .send("Invalid login or password.")
        }
    }

    static async logout() {

    }

    static async refreshTokens(req, res) {

    }
}

export default AuthController