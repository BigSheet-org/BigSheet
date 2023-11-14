import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../../routes/auth.js";


class TokenFactory {

    /**
     * Method used to generate a pair of auth and refresh tokens.
     *
     * @param userID Id of the user that needs tokens.
     * @returns {{auth: (string), refresh: (string)}}
     */
    static createTokens(userID){
        let authSecret = process.env.JWT_AUTH_SECRET_KEY
        let refreshSecret = process.env.JWT_REFRESH_SECRET_KEY
        return {
            auth: TokenFactory.generateToken(authSecret, userID),
            refresh: TokenFactory.generateToken(refreshSecret, userID)
        }
    }

    /**
     * Method used to generate a JWT.
     *
     * @param secret Secret used to generate the token.
     * @param userID Id of the user that needs tokens.
     * @returns string
     */
    static generateToken(secret, userID) {
        let data = {
            time: Date(),
            userID: userID,
            salt: bcrypt.genSalt(10)
        }
        return jwt.sign(data, secret)
    }

    banUserTokens(){

    }
}

export default TokenFactory