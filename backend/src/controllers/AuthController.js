import AuthMiddleware from "../common/middleware/AuthMiddleware.js";
import TokenFactory from "../common/tools/Factories/TokenFactory.js";
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
        if(await AuthMiddleware.authenticate(req.body.login, req.body.password)) {
            let userConcerned = await UserModel.getUserByLogin(req.body.login)

            // We prepare the auth and refresh tokens.
            let tokens = TokenFactory.createTokens(userConcerned.id)

            // We send the generated tokens.
            return res.send(tokens)
        } else {
            // We send an 401 auth code.
            return res.status(401)
               .send("Invalid login or password.")
        }
    }

    static async logout() {

    }

    static async refreshTokens() {

    }
}

export default AuthController