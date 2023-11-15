import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class Tokens {

    /**
     * Collection of data useful for the token's management and generation.
     * @type {{AUTH_EXP_TIME: string, REFRESH_SECRET: string, REFRESH_EXP_TIME: string, AUTH_SECRET: string}}
     */
    static UTILS = {
        AUTH_SECRET: process.env.JWT_AUTH_SECRET_KEY,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET_KEY,
        AUTH_EXP_TIME: process.env.AUTH_TOKEN_EXPIRE,
        REFRESH_EXP_TIME: process.env.REFRESH_TOKEN_EXPIRE,
    }

    /**
     * This function generates a pair of refresh and auth tokens.
     *
     * @param userID User concerned by the token.
     * @returns {{auth: (String), refresh: (String)}}
     */
    static generateTokens(userID){
        let authOptions = { expiresIn: Tokens.UTILS.AUTH_EXP_TIME }
        let refreshOptions = { expiresIn: Tokens.UTILS.REFRESH_EXP_TIME }

        return {
            auth: Tokens.generateToken(Tokens.UTILS.AUTH_SECRET, userID, authOptions),
            refresh: Tokens.generateToken(Tokens.UTILS.REFRESH_SECRET, userID, refreshOptions)
        }
    }

    /**
     * Method used to generate a JWT.
     *
     * @param secret Secret used to generate the token.
     * @param userID Id of the user that needs tokens.
     * @param options Options to add to the JWT (most importantly, expiration time).
     * @returns Tokens generated.
     */
    static generateToken(secret, userID, options) {
        let data = {
            time: Date(),
            userID: userID,
            salt: bcrypt.genSalt(10)
        }
        return jwt.sign(data, secret, options)
    }

    /**
     * This method checks if the auth token is valid.
     * (Not expired and signed properly.)
     */
    static verifyAuthToken(auth) {
        try {
            return jwt.verify(auth, Tokens.UTILS.AUTH_SECRET)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * This method checks if the refresh token is valid.
     * (Not expired and signed properly.)
     */
    static verifyRefreshTokens(refresh) {
        try {
            return jwt.verify(refresh, Tokens.UTILS.REFRESH_SECRET)
        } catch (e) {
            console.log(e)
        }
    }
}

export default Tokens