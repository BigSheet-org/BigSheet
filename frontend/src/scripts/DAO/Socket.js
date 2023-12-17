import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import LocalStorage from "./LocalStorage.js";
import Data from "../../assets/static/Data.js";
import Formatters from "../Utility/Formatters.js";
import cell from "../../components/sheet/Cell.vue";
class Socket {

    static SERVER_URL = "http://localhost:8000"

    /**
     * Socket constructor.
     * Builds a new socket to the server.
     */
    constructor(sheetID) {
        this.socket = io(Socket.SERVER_URL, {
            transports: ['websocket']
        });
        this.socket.on(Data.SOCKET_STANDARDS.AUTH_REQUIRED, (arg, callback) => {
            callback({
                token: LocalStorage.getAccessToken(),
                sheetId: sheetID
            });
        });
        // TODO : Try to refresh tokens if it expires
        this.socket.on(Data.SOCKET_STANDARDS.AUTH_REFUSED, (arg) => {
            console.log("[INFO] - Auth Unsuccessful.");
        });
        this.socket.on(Data.SOCKET_STANDARDS.AUTH_SUCCESS, (arg) => {
            console.log("[INFO] - Auth successful.");
        });
        this.socket.on(Data.SOCKET_STANDARDS.WRITE_CELL, (arg) => {
            console.log("[INFO] - Received following data : \n" + arg);
        });
    }

    /**
     * This method shares a change on a cell to all users connected to the server and editing the sheet.
     *
     * @param cellID ID of the modified cell.
     * @param payload Data changed.
     */
    sendRoom(cellID, payload) {
        let colsAndLine = Formatters.extractColumnAndLinesFromColumnID(cellID);
        let data = {
            line: colsAndLine.line,
            column: colsAndLine.column,
            content: payload
        }
        console.log("[INFO] - Sent Following data :");
        console.log(data)
        this.socket.emit("writeCell", data);
    }
}

export default Socket;