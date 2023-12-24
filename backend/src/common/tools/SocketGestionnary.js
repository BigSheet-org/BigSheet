import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";
import UserModel from "../../model/UserModel.js";
import SheetModel from "../../model/SheetModel.js";
import { CellModel } from "../../association/CellModel.js";
import { numColCharsToInt } from "./functions.js";
import { UserAccessSheet } from "../../association/UserAccessSheet.js";
import Tokens from "./Tokens.js";

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
            this.usersInSheet = {};
            this.sheets = {};
            this.sockAuthentified = new Set();
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
                sock.on('disconnecting', (reason) => {
                    if (this.sockAuthentified.has(sock)) {
                        const sheetId = this.getSheetId(sock);
                        const userId = this.getUserId(sock);
                        const user = this.usersInSheet[sheetId][userId];
                        this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_USER_DISCONNECTION, user);
                        delete this.usersInSheet[sheetId][userId];
                        // if nobody connected to this sheet
                        if (Object.keys(this.usersInSheet[sheetId]).length === 0) {
                            delete this.usersInSheet[sheetId];
                            delete this.sheets[sheetId];
                        }
                        this.sockAuthentified.delete(sock);
                    }
                });
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
     * Affect a cell to a user if it's not already affected and he has write access
     * @param sock Client's socket
     * @param line Number integer
     * @param column String 
     */
    async selectCellByUser(sock, line, column) {
        const sheetId = this.getSheetId(sock);
        const userId = this.getUserId(sock);
        const cell = await CellModel.getOrBuilt(sheetId, line, column);
        // if other user is already on cell
        for (const key in this.usersInSheet[sheetId]) {
            if (Number(key) !== userId && cell.equals(this.usersInSheet[sheetId][key].cell)) {
                this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.RESPONSE_SELECT_CELL, 'error');
                return false;
            }
        }
        this.usersInSheet[sheetId][this.getUserId(sock)].cell = cell;
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
        const cell = this.usersInSheet[this.getSheetId(sock)][this.getUserId(sock)].cell;
        if (cell !== null) {
            cell.content = text;
            this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.WRITE_CELL, cell);
            cell.save();
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
                const access = await UserAccessSheet.getAccessByPk(userId, sheetId);
                if (access !== null) {
                    sock.join('user' + userId);
                    sock.join('sheet' + sheetId);
                    // if nobody connected to this sheet
                    if (this.usersInSheet[sheetId] === undefined) {
                        this.usersInSheet[sheetId] = {};
                        this.sheets[sheetId] = (await SheetModel.getById(sheetId));
                    }
                    let user = {
                        userId: userId,
                        login: access.user.login,
                        cell: null,
                        access: access.accessRight
                    };
                    // confirm auth success
                    this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_SUCCESS);
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
}

export default SocketGestionnary;