class LocalStorage {

    static saveToLocalStorage(access_token, refresh_token){
        window.localStorage.setItem("access_token", access_token)
        window.localStorage.setItem("refresh_token", refresh_token)
    }

    static cleanLocalStorage(){
        window.localStorage.clear()
    }

    static getAccessToken() {
        return window.localStorage.getItem("access_token")
    }

    static getRefreshToken() {
        return window.localStorage.getItem("refresh_token")
    }

}