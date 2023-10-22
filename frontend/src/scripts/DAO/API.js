/**
 * @description API class. Contains all methods required to talk to the API, no matter which env you are running on (dev or prod)
 * It is a singleton class ! Use it wisely
 */
import ErrorForDisplay from "../ErrorForDisplay.js"
import User from "./User.js";

class API {

    /**
     * @description URL to API. if dev mode is used (npm run dev) : localhost, otherwise, it is the deployed API.
     * @type {string}
     */
    API_URL = import.meta.env.DEV ? 'http://localhost:8000' : '' ;

    /**
     * @enum {CONTENT_TYPE}
     * @description Enum of HTTP methods. Please use them instead of Strings.
     * It will be useful to properly build HTTP requests.
     */
    METHODS = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        PATCH: 'PATCH',
    };

    /**
     * @enum {CONTENT_TYPE}
     * @description Enum of content Types. PLease use them instead of Strings.
     * It will be useful to properly build HTTP requests.
     */
    CONTENT_TYPE = {
        JSON: 'application/json',
        URL_ENCODED: 'application/x-www-form-urlencoded',
        FORM_DATA: 'multipart/form-data'
    };

    constructor() {
        if (!API.instance) {
            this.isRefreshing = false;
            this.refreshLock = Promise.resolve();
            API.instance = this;
        }
        return API.instance;
    }

    /**
     * @description Method that needs to be used to communicate with the API.
     * @param method HTTP method that needs to be used to fetch.
     * @param url Path for the route that we need to fetch.
     * @param body Body send with the request (data that needs to be sent).
     * @param supplied_content_type Body's content type.
     * @param headers Additional headers (mainly used to authenticate the user)
     * @returns {Promise<>} Returns the promise for the request.
     */
    request(method, url, body, supplied_content_type= this.CONTENT_TYPE.JSON, headers){
        return new Promise(async (resolve) => {
            // Building header for the request
            const header = {
                "Access-Control-Allow-Origin" : this.API_URL,
                "Accept": "application/json",                           // <- Indicates what data the application accepts
                "Origin": window.location.origin,
            }
            // Checking if content-type needs to be specified.
            if (supplied_content_type !== this.CONTENT_TYPE.FORM_DATA ) { header["Content-Type"] = supplied_content_type }
            // Adding eventual headers.
            // Mainly used for adding identification headers.
            for (const key in headers) { header[key] = headers[key] }

            // Setting up the timeout mechanism :
            setTimeout(
                () => {
                    resolve(new ErrorForDisplay(504 ,
                        "Timeout waiting for response after "
                        + Data.PROGRAM_VALUES.timeout + " ms"))
                },
                Data.PROGRAM_VALUES.timeout
            )

            // Fetching data from the server
            const response = await fetch(
                `${this.API_URL}${url}`,
                {
                        method: method,
                        headers: header,
                        mode: 'cors',
                        body: body
                    }
                );

            // When we got our response, we check the status code.
            let data = await response.json()
            switch (response.status){
                // Successful response
                case 200:
                    resolve(data)
                    break;
                // Unsuccessful response
                default :
                    resolve(new ErrorForDisplay(response.status, data.detail))
                    break;
            }
        })
    }

    async request_logged(method, url, body, content_type) {

        let response
        if (!this.isRefreshing){
            response = await this.request(method, url, body, content_type, {['Authorization'] : `Bearer ${User.getAccessToken()}`})
        }

        // If we get an Unauthorized response
        // It would be of ErrorForDisplay type, so we can use default fields from this class
        if ((response.error_code !== undefined && response.error_code === 401) || this.isRefreshing) {

            // If we are not refreshing the token, we try refreshing it.
            if (!this.isRefreshing) {
                this.isRefreshing = true;
                // If we were not able to refresh the tokens :
                // Logout the user, redirect to login page, etc... are handled by the refresh tokens method
                this.refreshLock = User.refreshTokens()
                    .then(() => { this.isRefreshing = false })
            }

            // Wait for the current refresh to complete before continuing
            await this.refreshLock;
            response = await this.request(method, url, body, content_type, {['Authorization'] : `Bearer ${User.getAccessToken()}`})
        }
        return response
    }
}
export const api = new API();