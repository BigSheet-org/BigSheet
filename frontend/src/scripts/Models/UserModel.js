import Utils from "../Utility/Utils.js";

class UserModel {

    _userID;
    _login;
    _color;

    constructor(login, userID) {
        this._userID = userID;
        this._login = login;
        this._color = Utils.generateRandomHexColor();
    }

    get userID() { return this._userID; }
    get login() { return this._login; }
    get color() { return this._color; }

    /**
     * This method allows us to do a type check for the UserList.
     *
     * @returns {boolean}
     */
    get isUser() { return true; }

    /**
     * Returns the first letter of the login to build the user's icon.
     *
     * @return {string}
     */
    getInitials() { return this._login.charAt(0); }
}

export default UserModel;