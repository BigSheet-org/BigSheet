import user from "../DAO/User.js";

class UserList {

    _userList;

    constructor() {
        this._userList = [];
    }

    get userList() {
        return this._userList;
    }

    getUser(userID) {
        for (let i = 0; i < this._userList.length; i++) {
            if (this._userList[i].userID === userID) {
                return this._userList[i];
            }
        }
        return null;
    }

    addUser(user) {
        if (user.isUser !== undefined) {
            let existing = this.getUser(user.userID);
            if (existing === null) {        // We ensure that we do not add duplicates (happens a lot.)
                this._userList.push(user);
            }
        }
    }

    removeUser(userID) {
        let userToRemove = this.getUser(userID);
        if (userToRemove !== null) {                                            // We check that the user exists.
            this._userList.splice(this._userList.indexOf(userToRemove), 1);     // We remove the user.
        }
    }
}

export default UserList;