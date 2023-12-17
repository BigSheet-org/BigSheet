import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";

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
            this.usersInSheet = [];
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
        return [...sock.rooms][1];
    }

    /**
     * Get user personnal room who has joined by a client.
     * @param sock Socket's client 
     * @returns room
     */
    getUserRoom(sock) {
        return [...sock.rooms][2];
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
}

export default SocketGestionnary;