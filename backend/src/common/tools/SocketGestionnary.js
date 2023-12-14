import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";

class SocketGestionnary {
    static #instance = null;

    constructor(httpServ) {
        if (SocketGestionnary.#instance == null) {
            SocketGestionnary.#instance = this;
            this.io=new Server(httpServ);
            this.io.on('connection', (sock) => {
                this.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REQUIRED);
                for (const message in SOCKET_PROTOCOL.MESSAGE_TYPE.FROM_CLIENT) {
                    sock.on(message.name, (arg) => {
                        if (message.checkerArg(arg)) {
                            message.event();
                        }
                    });
                }
            });
        }
        return SocketGestionnary.#instance;
    }

    static getInstance() {
        return SocketGestionnary.#instance;
    }
    /**
     * Send message to user with the socket
     * @param sock User's socket
     * @param message Message defined in SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT
     */
    emit(sock, message, arg) {
        if (arg === undefined) {
            arg = '';
        }
        if (message.replyProcess != null) {
            sock.timeout(SOCKET_PROTOCOL.TIMEOUT_WHEN_REPLY_IS_REQUIRED);
            sock.emit(message.name, arg, message.replyProcess(sock));
        } else {
            sock.emit(message.name, arg);
        }
    }

    emitToRoom(sock, message, arg) {
        if (arg === undefined) {
            arg = '';
        }
        sock.to(this.getRoom(sock)).emit(message.name, arg);
    }

    getRoom(sock) {
        return [...sock.rooms][1];
    }
   
}

export default SocketGestionnary;