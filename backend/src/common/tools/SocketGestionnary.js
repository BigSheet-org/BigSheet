import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";
import UserModel from "../../model/UserModel.js";

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
            this.usersInSheet=[];
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
                    const user = this.usersInSheet[this.getSheetId(sock)][this.getUserId(sock)];
                    this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_USER_DISCONNECTION, user);
                    delete this.usersInSheet[this.getSheetId(sock)][this.getUserId(sock)];
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

    getUserId(sock) {
        return Number(this.getUserRoom(sock).substring(4));
    }

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
     * Add socket in a sheet room and notify all clients
     * @param sock Socket's client
     * @param sheetId id's sheet that client want access
     */
    async addUserInSheet(sock, sheetId) {
        sock.join('sheet'+sheetId);
        if (this.usersInSheet[sheetId] === undefined) {
            this.usersInSheet[sheetId] = [];
        }
        // we suppose socket has join his personnal before
        let userId = this.getUserId(sock);
        let user = {
            userId: userId,
            login: (await UserModel.getById(userId)).login
        };
        // send other clients login to this clients
        for (let i in this.usersInSheet[sheetId]) {
            let userConnected = this.usersInSheet[sheetId][i];
            this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_NEW_CONNECTION, userConnected);
        } 
        this.usersInSheet[sheetId][userId]=user;
        // send login to other clients
        this.emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_NEW_CONNECTION, user);
        
    }
}

export default SocketGestionnary;