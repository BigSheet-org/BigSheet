import Utils from "../Utility/Utils.js";

class UserModel {

    _login
    _color

    constructor(login) {
        this._login = login;
        this._color = Utils.generateRandomHexColor();
    }

    get login() {
        return this._login;
    }
    get color() {
        return this._color;
    }

    /**
     * Returns the first letter of the login to build the user's icon.
     *
     * @return {string}
     */
    getInitials() {
        return this._login.charAt(0);
    }


}

export default UserModel;