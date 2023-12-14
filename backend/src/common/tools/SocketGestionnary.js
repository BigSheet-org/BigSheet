import { Server } from "socket.io";

import SOCKET_PROTOCOL from "./SocketProtocol.js";

class SocketGestionnary {
    constructor(httpServ) {
        this.io=new Server(httpServ);
        this.io.on('connection', (sock) => {
            SocketGestionnary.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REQUIRED);
        });
    }

    /**
     * Send message to user with the socket
     * @param sock User's socket
     * @param message Message defined in SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT
     */
    static emit(sock, message, arg) {
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
}

export default SocketGestionnary;