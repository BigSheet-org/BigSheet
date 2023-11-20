import {api} from './API.js'

class User {

    static BASE_PATH = "/users"

    static loginUser(login, password) {
        return api.request(
            api.METHODS.POST,
            api.AUTH_BASE_PATH + '/login',
            `login=${login}&password=${password}`,
            api.CONTENT_TYPE.URL_ENCODED
        )
    }

    static logoutUser() {
        return api.request(
            api.METHODS.POST,
            api.AUTH_BASE_PATH + '/logout',
            JSON.stringify({
                access_token: User.getAccessToken(),
                refresh_token: User.getRefreshToken()
            }),
            api.CONTENT_TYPE.JSON
        )
    }

    static saveToLocalStorage(access_token, refresh_token){
        window.localStorage.setItem("access_token", access_token)
        window.localStorage.setItem("refresh_token", refresh_token)
    }

    static cleanLocalStorage(){
        window.localStorage.clear()
    }

    static async connectUser(login, password){
        // We use this function to replace eventual '+' signs in the password
        // They have a special encoding in the URLFormEncoded which is '%2B'
        password = User.convertPlusToEncoded(password)

        // Trying to log in user
        let promise = User.loginUser(login, password)
            .then((data) => {
                if (data.error_code === undefined) {
                    User.saveToLocalStorage(data.access_token, data.refresh_token)
                }
                return data
            })
        return await promise
    }

    static async logout() {
        await User.logoutUser()
        User.cleanLocalStorage()
        window.location.reload()
    }

    static isUserConnected() {
        return (User.getAccessToken() !== null && User.getRefreshToken() !== null)
    }

    static getAccessToken() {
        return window.localStorage.getItem("access_token")
    }

    static getRefreshToken() {
        return window.localStorage.getItem("refresh_token")
    }

    static registerUser(user) {
        const body = JSON.stringify(user)
        return api.request(api.METHODS.POST, "/users/register", body)
    }

    static fetchUserData() {
        return api.request_logged(api.METHODS.GET, "/users/me")
    }

    static async refreshTokens() {
        // Trying to log in user
        return api.request(api.METHODS.POST,
            api.AUTH_BASE_PATH + "/refresh",
            JSON.stringify({"refresh_token": User.getRefreshToken()})
        ).then((response) => {
            // If the refresh was unsuccessful, we disconnect the user.
            if (response.error_code !== undefined && response.error_code === 401) {
                User.cleanLocalStorage()
                window.location.reload()
            } else {
                User.cleanLocalStorage()
                User.saveToLocalStorage(
                    response['access_token'],
                    response['refresh_token']
                )
            }
        })
    }

    static async modifyUser() {
        return api.request(
            api.METHODS.PATCH,
            '/users/',
            JSON.stringify({
                access_token: User.getAccessToken(),
                refresh_token: User.getRefreshToken()
            }),
            api.CONTENT_TYPE.JSON
        )
    }
}

export default User
