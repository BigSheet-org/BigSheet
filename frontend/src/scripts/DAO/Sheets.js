import {api} from "./API.js";

class Sheets {

    static async getOwnedSheets() {
        return await api.request_logged(
            api.METHODS.GET,
            "/sheets/all"
        );
    }
}

export default Sheets