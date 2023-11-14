import UserModel from "../model/UserModel.js";

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
     * getCurrentUser this method will ask the model to get the connected user.
     *
     * @param req Request provided. Contains the parameter required in its body.
     * @param res Response to provide.
     * @returns {Promise<void>}
     */
    static async getCurrentUser(req, res) {

    }
}

export default UserController
