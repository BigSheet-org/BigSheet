import UserModel from "../../model/UserModel.js";
import bcrypt from "bcrypt";

class UserController {
    /**
     * getById this method will ask the model to get the user qualified by the id.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getById(req, res) {
        let user = await UserModel.getById(req.params.id)
        if (user === null) {
            res.status(404)
                .send(`User with id ${req.params.id} does not exists.`)
        } else {
            res.send(user)
        }
    }

    /**
     * This method will provide the hash of the plain text password provided.
     * It will use the bcrypt hash method and a salt that is 10 character long.
     *
     * @param plainTextPassword Password to hash.
     * @returns {Promise<void|*>}
     */
    async hashPassword(plainTextPassword) {
        return await bcrypt.hash(plainTextPassword, 10);
    }

    /**
     * This method will compare the hash and the plain text password provided?.
     *
     * @param plainTextPassword Password to compare
     * @param hash Hash to compare.
     * @returns {Promise<boolean>} If the password and hash match or not.
     */
    async comparePassword(plainTextPassword, hash) {
        return await bcrypt.compare(plainTextPassword, hash);
    }
}

export default UserController
