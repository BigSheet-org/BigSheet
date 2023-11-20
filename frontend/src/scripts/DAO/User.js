import {api} from './API.js'
import Formatters from "../Utility/Formatters.js";
import LocalStorage from "./LocalStorage.js";

class User {

    static BASE_PATH = "/users";

    static loginUser(login, password) {
        return api.request(
            api.METHODS.POST,
            api.AUTH_BASE_PATH + '/login',
            `login=${login}&password=${password}`,
            api.CONTENT_TYPE.URL_ENCODED
        );
    }

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

    static async logout() {
        await User.logoutUser();
        LocalStorage.cleanLocalStorage();
        window.location.reload();
    }

    static isUserConnected() {
        return (LocalStorage.getAccessToken() !== null && LocalStorage.getRefreshToken() !== null);
    }

    static registerUser(user) {
        const body = JSON.stringify(user);
        return api.request(
            api.METHODS.POST,
            User.BASE_PATH + "/register",
            body
        );
    }

    static fetchUserData() {
        return api.request_logged(
            api.METHODS.GET,
            User.BASE_PATH + "/me"
        );
    }

    static async refreshTokens() {
        // Trying to log in user
        return api.request(api.METHODS.POST,
            api.AUTH_BASE_PATH + "/refresh",
            JSON.stringify({"refresh_token": LocalStorage.getRefreshToken()})
        ).then((response) => {
            // If the refresh was unsuccessful, we disconnect the user.
            if (response.error_code !== undefined && response.error_code === 401) {
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

    static async modifyUser(user) {
        console.log(user)

        return api.request(
            api.METHODS.PATCH,
            User.BASE_PATH +'/modify',
            JSON.stringify(body),
            api.CONTENT_TYPE.JSON
        );
    }
}

export default User
