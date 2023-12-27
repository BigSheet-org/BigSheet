import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";
import { CellModel } from "../../association/CellModel.js";
import { UserAccessSheet } from "../../association/UserAccessSheet.js";
import Tokens from "./Tokens.js";
import Data from "../data/Data.js";

/**
 * Singleton. Create and use a socket server to wait clients connections.
 */
class SocketGestionnary {
    /** Unique instance of this class. Private.*/
    static #instance = null;

    /**
     * Create or return the instance of SocketGestionnary.
     * @param httpServ Express server
     * @returns SocketGestionnary
     */
    constructor(httpServ) {
        if (SocketGestionnary.#instance === null) {
            SocketGestionnary.#instance = this;
            // create a socket server
            this.io = new Server(httpServ);
            // object to stock users connected on each sheet.
            this.usersInSheet = {};
            // object to stock cells must be saved on each sheet.
            this.cellsNotSavedPerSheet = {};
            // Set to know sockets who are authentified
            this.sockAuthentified = new Set();
            // object counter to know a sheet must be saved.
            this.saveInNbModif = {};
            // When a client connects, requests authentication
            this.io.on('connection', (sock) => {
                // requests authentication
                this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REQUIRED);
                // init all event when a client send message to server
                for (const key in SOCKET_PROTOCOL.MESSAGE_TYPE.FROM_CLIENT) {
                    let message = SOCKET_PROTOCOL.MESSAGE_TYPE.FROM_CLIENT[key];
                    sock.on(message.name, (arg) => {
                        if (message.checkerArg(arg)) {
                            message.event(sock, arg);
                        }
                    });
                }
                sock.on('disconnecting', (reason) => this.disconnect(sock));
            });
        }
        return SocketGestionnary.#instance;
    }

    /**
     * Gives unique instance of SocketGestionnary.
     * @returns SocketGestionnary
     */
    static getInstance() {
        return SocketGestionnary.#instance;
    }

    /**
     * Send message to user with the socket
     * @param sock User's socket
     * @param message Message defined in SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT
     * @param arg Argument in message
     */
    emit(sock, message, arg) {
        if (arg === undefined) {
            arg = '';
        }
        // If message wait a response
        if (message.replyProcess !== null) {
            sock.timeout(SOCKET_PROTOCOL.TIMEOUT_WHEN_REPLY_IS_REQUIRED);
            sock.emit(message.name, arg, message.replyProcess(sock));
        } else {
            sock.emit(message.name, arg);
        }
    }

    /**
     * Emits a message to the socket's client's room. Useful when a client send message who must be re-sent to others client in same room.
     * @param sock      Client's socket which has sent the message.
     * @param message   Message type compatible defined in SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.
     * @param arg       Argument in message.
     */
    emitToSheetRoom(sock, message, arg) {
        if (arg === undefined) {
            arg = '';
        }
        sock.to(this.getSheetRoom(sock)).emit(message.name, arg);
    }

    /**
     * Get sheet room who has joined by a client.
     * @param sock Socket's client 
     * @returns room
     */
    getSheetRoom(sock) {
        return [...sock.rooms][2];
    }

    /**
     * Get user personnal room who has joined by a client.
     * @param sock Socket's client 
     * @returns room
     */
    getUserRoom(sock) {
        return [...sock.rooms][1];
    }

    /**
     * Get userId for user connected by sock
     * @param sock Socket's client 
     * @returns userId
     */
    getUserId(sock) {
        return Number(this.getUserRoom(sock).substring(4));
    }

    /**
     * Get sheetId for user connected by sock
     * @param sock Socket's client 
     * @returns sheetId
     */
    getSheetId(sock) {
        return Number(this.getSheetRoom(sock).substring(5));
    }

    /**
     * Emits a message to the socket's client's room. Useful when a client send message who must be re-sent to others client in same room.
     * @param sock      Client's socket which has sent the message.
     * @param userId    User must be received the message.
     * @param message   Message type compatible defined in SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.
     * @param arg       Argument in message.
     */
    emitToUser(sock, userId, message, arg) {
        if (arg === undefined) {
            arg = '';
        }
        sock.to("user"+userId).emit(message.name, arg);
    }

    /**
     * To disconnect client's socket with different reason.
     * @param sock Client's socket
     * @param message Reason to disconnection (string)
     */
    refuseAuth(sock, reason) {
        this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED, reason);
        sock.disconnect();
    }

    /**
     * Affect a cell to a user if it's not already affected and he has write permission
     * @param sock Client's socket
     * @param line Number integer
     * @param column String 
     */
    async selectCellByUser(sock, line, column) {
        const sheetId = this.getSheetId(sock);
        const userId = this.getUserId(sock);
        // if not permission to write
        if (this.usersInSheet[sheetId][userId].access === Data.SERVER_COMPARISON_DATA.PERMISSIONS.READ) {
            this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.RESPONSE_SELECT_CELL, 'error');
            return false;
        }
        const cell = await CellModel.getOrBuilt(sheetId, line, column);
        // if other user is already on cell
        for (const key in this.usersInSheet[sheetId]) {
            if (Number(key) !== userId && cell.equals(this.usersInSheet[sheetId][key].cell)) {
                this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.RESPONSE_SELECT_CELL, 'error');
                return false;
            }
        }
        this.usersInSheet[sheetId][userId].cell = cell;
        this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.RESPONSE_SELECT_CELL, 'ok');
        this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.USER_SELECT_CELL, this.usersInSheet[sheetId][userId]);
        return true;

    }

    /**
     * Modify content in selected cell by client 
     * @param sock Client's socket
     * @param text Content
     */
    writeCell(sock, text) {
        const sheetId = this.getSheetId(sock);
        const cell = this.usersInSheet[sheetId][this.getUserId(sock)].cell;
        if (cell !== null) {
            cell.content = text;
            this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.WRITE_CELL, cell);
            if (this.cellsNotSavedPerSheet[sheetId] === undefined) {
                this.cellsNotSavedPerSheet[sheetId] = new Set();
            }
            this.cellsNotSavedPerSheet[sheetId].add(cell);
            this.saveInNbModif[sheetId]--;
            if (this.saveInNbModif[sheetId] === 0) {
                this.save(sheetId);
            }
        }
    }

    /**
     * Add socket in a sheet room and notify all clients
     * @param sock Socket's client
     * @param sheetId id's sheet that client want access
     */
    async authentifyUserInSheet(sock, token, sheetId) {
        // verify token auth
        let data = await Tokens.verifyAuthToken(token);
        if (data.error !== undefined) {
            this.refuseAuth(sock, 'not authentified');
        } else {
            const userId = data.userID;
            if (this.usersInSheet[sheetId] !== undefined && this.usersInSheet[sheetId][userId] !== undefined) {
                this.refuseAuth(sock, 'already connected');
            } else {
                // save to can load cells already init 
                await this.save(sheetId);
                const access = await UserAccessSheet.getAccessByPk(userId, sheetId);
                if (access !== null) {
                    sock.join('user' + userId);
                    sock.join('sheet' + sheetId);
                    // if nobody connected to this sheet
                    if (this.usersInSheet[sheetId] === undefined) {
                        this.usersInSheet[sheetId] = {};
                        this.saveInNbModif[sheetId] = Data.SAVE_TIME;
                    }
                    let user = {
                        userId: userId,
                        login: access.user.login,
                        cell: null,
                        access: access.accessRight
                    };
                    // confirm auth success
                    this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_SUCCESS);
                    this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.LOAD_CELLS, access.sheet.cells);
                    // send other clients login to this client
                    for (let i in this.usersInSheet[sheetId]) {
                        let userConnected = this.usersInSheet[sheetId][i];
                        this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_NEW_CONNECTION, userConnected);
                    } 
                    this.usersInSheet[sheetId][userId] = user;                    
                    // send login to other clients
                    this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_NEW_CONNECTION, user);
                    this.sockAuthentified.add(sock);
                } else {
                    this.refuseAuth(sock, 'not access');
                }
            }
        }
    }

    /**
     * Save Cells who are not saved in DB
     * @param sheetId Id of a sheet
     */
    async save(sheetId) {
        if (this.cellsNotSavedPerSheet[sheetId] !== undefined) {
            let iterator = this.cellsNotSavedPerSheet[sheetId].values();
            let item = iterator.next();
            while (!item.done) {
                await item.value.save();
                item = iterator.next();
            }
            this.saveInNbModif[sheetId] = Data.SAVE_TIME;
            delete this.cellsNotSavedPerSheet[sheetId];
        }
    }

    /**
     * To remove auth when a user's is disconnected and inform other users.
     * @param sock Socket's client
     */
    disconnect(sock) {
        if (this.sockAuthentified.has(sock)) {
            const sheetId = this.getSheetId(sock);
            const userId = this.getUserId(sock);
            const user = this.usersInSheet[sheetId][userId];
            this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_USER_DISCONNECTION, user);
            this.save(sheetId);
            delete this.usersInSheet[sheetId][userId];
            // if nobody connected to this sheet
            if (Object.keys(this.usersInSheet[sheetId]).length === 0) {
                delete this.usersInSheet[sheetId];
                delete this.saveInNbModif[sheetId];
            }
            this.sockAuthentified.delete(sock);
        }
    }
}

export default SocketGestionnary;