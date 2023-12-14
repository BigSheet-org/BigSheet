import SocketGestionnary from "./SocketGestionnary.js";
import Tokens from "./Tokens.js";
import { UserAccessSheet } from "../../association/UserAccessSheet.js";

const SOCKET_PROTOCOL = {
    TIMEOUT_WHEN_REPLY_IS_REQUIRED: 5000,
    MESSAGE_TYPE: {
        TO_CLIENT: {
            AUTH_REQUIRED: {
                name: 'authReq',
                replyProcess: requestAuth
            },
            AUTH_REFUSED: {
                name: 'authFail',
                replyProcess: null
            }, 
            AUTH_SUCCESS: {
                name: 'authOk',
                replyProcess: null
            }
        },
        FROM_CLIENT: {
            
        }
    }
};

function emitReasonToDisconnect(sock, message) {
    SocketGestionnary.emit(sock, message);
    sock.disconnect();
}

function requestAuth(sock) {
    return async (err, response) => {
        // if an error (access not autorized...) disconnect socket
        if (err) {
            emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
        } else {
            if (response.token !== undefined && response.sheetId !== undefined) {
                let data = await Tokens.verifyAuthToken(response.token);
                if (data.error !== undefined) {
                    emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
                } else {
                    let access = await UserAccessSheet.getAccessByPk(data.userID, response.sheetId);
                    // if user has access to sheet, he joins the room corresponding to corresponding to sheet
                    if (access != null) {
                        sock.join('sheet'+response.sheetId);
                        SocketGestionnary.emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_SUCCESS);
                    } else {
                        emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
                    }                            
                }
            } else {
                emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
            }
        }
    };
}

export default SOCKET_PROTOCOL;