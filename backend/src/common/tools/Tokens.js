import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import RedisClient from "./redis.js";
import Data from "../data/Data.js";

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
     * @returns {{access_token: (*), refresh_token: (*)}}
     */
    static generateTokens(userID){
        let authOptions = { expiresIn: Tokens.UTILS.AUTH_EXP_TIME }
        let refreshOptions = { expiresIn: Tokens.UTILS.REFRESH_EXP_TIME }

        return {
            access_token: Tokens.generateToken(Tokens.UTILS.AUTH_SECRET, userID, authOptions),
            refresh_token: Tokens.generateToken(Tokens.UTILS.REFRESH_SECRET, userID, refreshOptions)
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
            salt: bcrypt.genSalt(10, (err, salt) => { return salt })
        }
        return jwt.sign(data, secret, options)
    }

    /**
     * This method checks if the auth token is valid.
     * (Not expired, not in the blacklist and signed properly.)
     */
    static verifyAuthToken(auth) {
        return Tokens.verifyToken(auth, Tokens.UTILS.AUTH_SECRET) 
            && !Tokens.isBanned(auth)
    }

    /**
     * This method checks if the refresh token is valid.
     * (Not expired, not in the blacklist and signed properly.)
     */
    static verifyRefreshTokens(refresh) {
        return Tokens.verifyToken(refresh, Tokens.UTILS.REFRESH_SECRET)
            && !Tokens.isBanned(refresh)

    }

    /**
     * This method uses the token and the secret provided to decode the token.
     * It returns the data inside if it has been successfully decoded, an error object otherwise.
     *
     * @param token Token to decode.
     * @param secret Secret to use to decode the token.
     * @returns {*|{error: string, status: boolean}}
     */
    static verifyToken(token, secret) {
        try {
            return jwt.verify(token, secret)
        } catch (e) {
            if (e.toString() === "TokenExpiredError: jwt expired") {
                return {
                    status: false,
                    error: Data.SERVER_COMPARISON_DATA.TOKENS.EXPIRED
                }
            } else {
                return {
                    status: false,
                    error: Data.SERVER_COMPARISON_DATA.TOKENS.INVALID
                }
            }
        }
    }

    /**
     * This method allows us to blacklist some tokens that have not expired yet.
     * They will be automatically removed at the end of their validity period.
     *
     * @param token Token to ban.
     * @param dataInToken Data extracted from the token.
     * @returns {Promise<void>}
     */
    static async banToken(token, dataInToken) {
        await RedisClient.set(token, dataInToken.userID)
        await RedisClient.expireAt(token, dataInToken.exp)
    }

    /**
     * This method checks if the token is present in the blacklist or not.
     *
     * @param auth Token to check.
     * @returns {boolean} Returns if it is in the blacklist or not.
     */
    static isBanned(auth) {
        return RedisClient.get(auth) !== null;
    }
}

export default Tokens