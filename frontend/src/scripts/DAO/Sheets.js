import {api} from "./API.js";

class Sheets {

    /**
     * Fetches all sheets where the current user has permission to access.
     *
     * @returns {Promise<*>}
     */
    static async getAllSheets() {
        return await api.request_logged(
            api.METHODS.GET,
            "/sheets/all"
        );
    }

    /**
     * Fetches all sheets where the current user has owner permissions.
     *
     * @returns {Promise<*>}
     */
    static async getOwnedSheets() {
        return await api.request_logged(
            api.METHODS.GET,
            "/sheets/owned"
        );
    }

    /**
     * Fetches all sheets where the current user has a shared access.
     *
     * @returns {Promise<*>}
     */
    static async getSharedSheets() {
        return await api.request_logged(
            api.METHODS.GET,
            "/sheets/shared"
        );
    }

    /**
     * Fetches the sheet qualified by the provided ID.
     *
     * @param sheetID ID to search for.
     * @returns {Promise<*>}
     */
    static async getSheet(sheetID) {
        return await api.request_logged(
            api.METHODS.GET,
            "/sheets/" + sheetID
        );
    }


    /**
     * Method to create a new sheet. Owned by the current user.
     *
     * @param data Must be in the following format : {title: "example", detail: "detail"}. Detail field is NOT mandatory.
     * @returns {Promise<void>}
     */
    static async createSheet(data) {
        return await api.request_logged(
            api.METHODS.POST,
            "/sheets/create",
            JSON.stringify(data)
        );
    }

    /**
     * Method to create a new sheet. Owned by the current user.
     *
     * @param data Must be in the following format : {title: "example", detail: "detail"}. Detail field is NOT mandatory.
     * @returns {Promise<void>}
     */
    static async deleteSheet(sheetID) {
        return await api.request_logged(
            api.METHODS.DELETE,
            "/sheets/" + sheetID,
        );
    }

}

export default Sheets