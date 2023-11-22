import {api} from './API.js'
import Formatters from "../Utility/Formatters.js";
import LocalStorage from "./LocalStorage.js";

class User {
    /** Base path for the users routes. */
    static BASE_PATH = "/users";

    /**
     * This method handles the connexion of the user.
     *
     * @param login Login to use for the connexion.
     * @param password Password to use for the connexion.
     * @returns {Promise<unknown>}
     */
    static async connectUser(login, password){
        // We use this function to replace eventual '+' signs in the password
        // They have a special encoding in the URLFormEncoded which is '%2B'
        password = Formatters.convertPlusToEncoded(password);

        // Trying to log in user
        let promise = User.loginUser(login, password)
            .then((data) => {
                if (data.error_code === undefined) {
                    LocalStorage.saveToLocalStorage(data.access_token, data.refresh_token);
                }
                return data;
            });
        return await promise;
    }

    /**
     * This method handles the logout of the user.
     * It makes the request and cleans the local storage before reloading the webpage.
     *
     * @returns {Promise<void>}
     */
    static async logout() {
        await User.logoutUser();
        LocalStorage.cleanLocalStorage();
        window.location.reload();
    }

    /**
     * This method makes the login request to the API.
     *
     * @param login Login to use for the connexion.
     * @param password Password to use for the connexion.
     * @returns {Promise}
     */
    static loginUser(login, password) {
        return api.request(
            api.METHODS.POST,
            api.AUTH_BASE_PATH + '/login',
            `login=${login}&password=${password}`,
            api.CONTENT_TYPE.URL_ENCODED
        );
    }

    /**
     * This method makes the logout request to the API.
     *
     * @returns {Promise}
     */
    static logoutUser() {
        return api.request(
            api.METHODS.POST,
            api.AUTH_BASE_PATH + '/logout',
            JSON.stringify({
                access_token: LocalStorage.getAccessToken(),
                refresh_token: LocalStorage.getRefreshToken()
            }),
            api.CONTENT_TYPE.JSON
        );
    }

    /**
     * This method creates and handles the request to refresh the current tokens.
     *
     * @returns {Promise<unknown>}
     */
    static async refreshTokens() {
        // Trying to log in user
        return api.request(api.METHODS.POST,
            api.AUTH_BASE_PATH + "/refresh",
            JSON.stringify({"refresh_token": LocalStorage.getRefreshToken()})
        ).then((response) => {
            // If the refresh was unsuccessful, we disconnect the user.
            if (response.error_code === 401) {
                LocalStorage.cleanLocalStorage();
                window.location.reload();
            } else {
                LocalStorage.cleanLocalStorage()
                LocalStorage.saveToLocalStorage(
                    response['access_token'],
                    response['refresh_token']
                )
            }
        });
    }

    /**
     * This method checks in the local storage the presence of the tokens.
     * @returns {boolean} If the user is connected or not.
     */
    static isUserConnected() {
        return (LocalStorage.getAccessToken() !== null && LocalStorage.getRefreshToken() !== null);
    }

    /**
     * This method builds and sends the request to create a new user.
     * @param user User object to extract new data from.
     * @returns {Promise}
     */
    static registerUser(user) {
        const body = JSON.stringify(user);
        return api.request(
            api.METHODS.POST,
            User.BASE_PATH + "/register",
            body
        );
    }

    /**
     * This method fetches the data concerning the connected user.
     * @returns {Promise<*>}
     */
    static fetchUserData() {
        return api.request_logged(
            api.METHODS.GET,
            User.BASE_PATH + "/me"
        );
    }

    /**
     * This method builds and sends the request to modify the connected user's information.
     *
     * @param newUser User object to extract new data from.
     * @param oldUser User object to compare form the old data.
     * @returns {Promise}
     */
    static async modifyUser(oldUser, newUser) {
        let user = {};
        if (newUser.login !== oldUser.login) {
            user.login = newUser.login;
        }
        if (newUser.mail !== oldUser.mail) {
            user.mail = newUser.mail;
        }
        if (newUser.firstname !== oldUser.firstname) {
            user.firstname = newUser.firstname;
        }
        if (newUser.lastname !== oldUser.lastname) {
            user.lastname = newUser.lastname;
        }
        if (newUser.password && newUser.confirmPassword) {
            user.password = newUser.password;
            user.confirmPassword = newUser.confirmPassword;
        }

        return api.request_logged(
            api.METHODS.PATCH,
            User.BASE_PATH +'/modify',
            JSON.stringify(user),
            api.CONTENT_TYPE.JSON
        );
    }

    /**
     * This deletes the user currently connected.
     * It also clears Tokens and reloads the page.
     *
     * @param userID Id of the user to delete.
     * @returns {Promise}
     */
    static async deleteUser(userID) {
        await api.request_logged(
            api.METHODS.DELETE,
            User.BASE_PATH +'/delete/' + userID,
        );
        return await User.logout();
    }
}

export default User
