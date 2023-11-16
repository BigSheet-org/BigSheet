import Data from "../common/data/Data.js";
import Tokens from "../common/tools/Tokens.js";
import UserModel from "../model/UserModel.js";

class UserMiddleware {

    static async hasValidRegisterFields(req, res, next) {
        let body = req.body
        if ((!body.firstname
            || !body.lastname
            || !body.mail
            || !body.login
            || !body.password
            || !body.confirmPassword)
        ) {
            return res.status(400)
                .send(Data.ANSWERS.ERRORS_400.MISSING_FIELDS);
        } else if (body.password !== body.confirmPassword) {    // We check if the passwords match.
            return res.status(400)
                .send(Data.ANSWERS.ERRORS_400.PASSWORD_DONT_MATCH);
        }
        // We check if login was already used :
        let user = await UserModel.getUserByLogin(body.login);
        if(user !== null) {
            return res.status(400)
                      .send(Data.ANSWERS.ERRORS_400.LOGIN_ALREADY_USED);
        }

        // We check if mail was already used :
        user = await UserModel.getUserByMail(body.mail);
        if(user !== null) {
            return res.status(400)
                      .send(Data.ANSWERS.ERRORS_400.MAIL_ALREADY_USED);
        }

        return next();
    }

    static async hasPermissionToDelete(req, res, next) {
        let userID = Number(await Tokens.getUserIdFromToken(await Tokens.getAuthTokenFromHeader(req)));
        let userIDToDelete = Number(req.params.id);

        console.log(userID)
        console.log(userIDToDelete)

        if(userID !== userIDToDelete) {
            return res.status(401)
                      .send(Data.ANSWERS.ERRORS_401.INSUFFICIENT_PERMS)
        }
        return next();

    }
}


export default UserMiddleware