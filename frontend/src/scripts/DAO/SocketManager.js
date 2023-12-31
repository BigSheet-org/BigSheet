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
        this.openSocket(sheetID, callbacks);
    }

    /**
     * This method shares a change on a cell to all users connected to the server and editing the sheet.
     *
     * @param payload Data changed.
     */
    sendRoom(payload) {
        this.socket.emit(Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL, payload);
    }

    /**
     * This method shares a cell selection.
     *
     * @param cellID  ID of the modified cell.
     */
    selectCell(cellID) {
        let colsAndLines = Formatters.extractColumnAndLinesFromColumnID(cellID);
        let data = {
            line: colsAndLines.line,
            column: colsAndLines.column,
        }
        this.socket.emit(Data.SOCKET_PROTOCOLS_QUALIFIERS.SELECT_CELL, data);
    }

    registerHandlers(callbacks) {
        // Handler for when users write inside of cells
        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL)
        );
        // Handler for when users connects.
        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_NEW_CONNECTION,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_NEW_CONNECTION)
        );
        // Handler for when users disconnects.
        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_USER_DISCONNECT,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_USER_DISCONNECT)
        );
        // Handler for the cell Selection by another user.
        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.USER_SELECT_CELL,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.USER_SELECT_CELL)
        );
    }

    openSocket(sheetID, callbacks) {
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
            // We try to refresh the tokens, and we try to open a socket again.
            await User.refreshTokens();
            this.openSocket(sheetID);
        });

        // If the auth is successful.
        this.socket.on(Data.SOCKET_PROTOCOLS_QUALIFIERS.AUTH_SUCCESS, (arg) => {
            this.registerHandlers(callbacks);
        });

        this.socket.on(
            Data.SOCKET_PROTOCOLS_QUALIFIERS.LOAD_CELLS,
            callbacks.getHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.LOAD_CELLS)
        );
    }

    /**
     * This method closes the connexion with the server.
     */
    closeSocket() { this.socket.close(); }
}

export default SocketManager;