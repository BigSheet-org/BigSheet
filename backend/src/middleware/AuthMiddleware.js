import bcrypt from "bcrypt";
import UserModel from "../model/UserModel.js";
import Tokens from "../common/tools/Tokens.js";
import Data from "../common/data/Data.js";

class AuthMiddleware {

    /**
     * Validator for the login request. Check if the mandatory fields are present.
     *
     * @param req Request provided.
     * @param res Response to send.
     * @param next Next method to call.
     * @returns {*}
     */
    static hasValidLoginFields(req, res, next){
        if (!req.body.login || !req.body.password) {
            return res.status(400)
                      .send(Data.ANSWERS.ERRORS_400.MISSING_FIELDS)
        }
        return next()
    }

    /**
     * Validator for the login request. Check if the mandatory fields are present.
     *
     * @param req Request provided.
     * @param res Response to send.
     * @param next Next method to call.
     * @returns {*}
     */
    static hasValidLogoutFields(req, res, next){
        if (!req.body.refresh_token || !req.body.access_token) {
            return res.status(400)
                .send(Data.ANSWERS.ERRORS_400.MISSING_FIELDS)
        }
        return next()
    }

    /**
     * Validator for the login request. Check if the mandatory fields are present.
     *
     * @param req Request provided.
     * @param res Response to send.
     * @param next Next method to call.
     * @returns {*}
     */
    static hasValidRefreshFields(req, res, next){
        if (!req.body.refresh_token) {
            return res.status(400)
                .send(Data.ANSWERS.ERRORS_400.MISSING_FIELDS)
        }
        return next()
    }

    /**
     * This method will provide the hash of the plain text password provided.
     * It will use the bcrypt hash method and a salt that is 10 character long.
     *
     * @param plainTextPassword Password to hash.
     * @returns {Promise<void|*>}
     */
    static async hashPassword(plainTextPassword) {
        return await bcrypt.hash(plainTextPassword, 10);
    }

    /**
     * This method will compare the hash and the plain text password provided?.
     *
     * @param plainTextPassword Password to compare
     * @param hash Hash to compare.
     * @returns {Promise<boolean>} If the password and hash match or not.
     */
    static async comparePassword(plainTextPassword, hash) {
        return await bcrypt.compare(plainTextPassword, hash);
    }

    /**
     * This method checks the credentials provided by the user.
     *
     * @param login Login of the user.
     * @param password Plain text password.
     * @returns {Promise<boolean>} If the user was authenticated or not.
     */
    static async authenticate(login, password) {
        // We find the user that has the login provided.
        let userConcerned = await UserModel.getUserByLogin(login)

        // If no user with this login exists.
        if(userConcerned === null) {
            return false
        }
        // We return the result of password matching.
        return await AuthMiddleware.comparePassword(password, userConcerned.hash)
    }

    /**
     * This method checks if the auth token is valid.
     * If it is, we call the next handler of the route.
     *
     * @param req Request provided.
     * @param res Response to send.
     * @param next Next handler to call.
     * @returns {*}
     */
    static async checkAuthToken(req, res, next) {
        // We try to find the auth token.
        let token;
        if (req.headers.authorization) {        // If it was found in the header.
            token = Tokens.getAuthTokenFromHeader(req)
        } else {                                // We try to find it in the body.
            token = req.body.access_token
        }
        let data = await Tokens.verifyAuthToken(token)
        // Don't worry, if no token ere found, the validate next method will send a 401 error.
        return AuthMiddleware.validateNext(data, res, next)
    }

    /**
     * This method checks if the auth refresh is valid.
     * If it is, we call the next handler of the route.
     *
     * @param req Request provided.
     * @param res Response to send.
     * @param next Next handler to call.
     * @returns {*}
     */
    static async checkRefreshToken(req, res, next) {
        let data = await Tokens.verifyRefreshTokens(req.body.refresh_token)
        return AuthMiddleware.validateNext(data, res, next)
    }

    /**
     * This method serves as a common checker for the tokens, since the results from the method that checks the
     * validity of the tokens are the same between auth and refresh tokens.
     *
     * @param data Data extracted from the token.
     * @param res Response to send.
     * @param next Next handler to call.
     * @returns {*}
     */
    static validateNext(data, res, next) {
        if (!data.status && data.error !== undefined) {
            // If the token was expired or invalid.
            if(data.error === Data.SERVER_COMPARISON_DATA.TOKENS.EXPIRED) {
                return res.status(401)
                    .send(Data.ANSWERS.ERRORS_401.EXPIRED_TOKEN)
            } else {
                return res.status(401)
                    .send(Data.ANSWERS.ERRORS_401.INVALID_TOKEN)
            }
        } else {
            return next()
        }
    }
}
export default AuthMiddleware