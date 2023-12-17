import {api} from "./API.js";

class Sheets {

    static async getOwnedSheets() {
        let data = await api.request_logged(
            api.METHODS.GET,
            "/sheets/all"
        );

        console.log(data);
        return data;
    }
}

export default Sheets