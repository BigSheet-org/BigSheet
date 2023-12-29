import Storage from "./Storage.js";
import Formatters from "../Utility/Formatters.js";
import Data from "../../assets/static/Data.js";
import User from "./User.js";
import {io} from "socket.io-client";

class SocketManager {

    static SERVER_URL = "http://localhost:8000"

    /**
     * Socket constructor.
     * Builds a new socket to the server.
     */
    constructor(sheetID, callbacks) {
        // this.openSocket(sheetID)
        // this.registerHandlers(callbacks)
    }

    /**
     * This method shares a change on a cell to all users connected to the server and editing the sheet.
     *
     * @param cellID  ID of the modified cell.
     * @param payload Data changed.
     */
    sendRoom(cellID, payload) {
        let colsAndLines = Formatters.extractColumnAndLinesFromColumnID(cellID);
        let data = {
            line: colsAndLines.line,
            column: colsAndLines.column,
            content: payload
        }
        console.log("[INFO] - Sent Following data :");
        console.log(data);
        this.socket.emit("writeCell", data);
    }

    registerHandlers(callbacks) {
        // Handler for when users write inside of cells
        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL)
        );
    }

    openSocket(sheetID) {
        // Building the socket connexion.
        this.socket = io(SocketManager.SERVER_URL);

        // When the auth is asked by the server.
        this.socket.on(Data.SOCKET_PROTOCOLS_QUALIFIERS.AUTH_REQUIRED, (arg, callback) => {
            callback({
                token: Storage.getAccessToken(),
                sheetId: sheetID
            });
        });

        // If the auth has failed
        this.socket.on(Data.SOCKET_PROTOCOLS_QUALIFIERS.AUTH_REFUSED, async (arg) => {
            console.log("[INFO] - Auth Unsuccessful. " + arg);
            // We try to refresh the tokens, and we try to open a socket again.
            await User.refreshTokens();
            this.openSocket(sheetID);
        });

        // If the auth is successful.
        this.socket.on(Data.SOCKET_PROTOCOLS_QUALIFIERS.AUTH_SUCCESS, (arg) => {
            console.log("[INFO] - Auth successful. " + arg);
        });
    }
}

export default SocketManager;