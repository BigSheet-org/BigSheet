class LocalStorage {

    static saveToLocalStorage(access_token, refresh_token){
        window.sessionStorage.setItem("access_token", access_token);
        window.sessionStorage.setItem("refresh_token", refresh_token);
    }

    static cleanLocalStorage(){
        window.sessionStorage.clear();
    }

    static getAccessToken() {
        return window.sessionStorage.getItem("access_token");
    }

    static getRefreshToken() {
        return window.sessionStorage.getItem("refresh_token");
    }
}

export default LocalStorage;