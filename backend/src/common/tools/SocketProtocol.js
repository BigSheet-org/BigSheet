import SocketGestionnary from "./SocketGestionnary.js";
import Tokens from "./Tokens.js";
import { UserAccessSheet } from "../../association/UserAccessSheet.js";
import { isCapitalWord } from "./functions.js";
import UserModel from "../../model/UserModel.js";

/**
 * Define different message which can be sent or received by the server.
 * TO_CLIENT.x.replyProcess is null or a function (sock) => function async (error, response) to act in terms of client's response.
 * FROM_CLIENT.x.checkerArg is a function (arg) => boolean to verify arg who has received. True if arg has good format.
 * FROM_CLIENT.x.event is a function (sock, arg) must be executed when received message from socket.
 */
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
            },
            WRITE_CELL: {
                name: 'writeCell',
                replyProcess: null
            },
            ALERT_ROOM_NEW_CONNECTION: {
                name: 'newConnect',
                replyProcess: null
            }
        },
        FROM_CLIENT: {
            WRITE_CELL: {
                name: 'writeCell',
                checkerArg: writeCellChecker,
                event: writeCellEvent
            }
        }
    }
};

/**
 * To disconnect client's socket with different reason.
 * @param sock Client's socket
 * @param message Reason to disconnection
 */
function emitReasonToDisconnect(sock, message) {
    SocketGestionnary.getInstance().emit(sock, message);
    sock.disconnect();
}

/**
 * Send request authentication for client.
 * @param sock client's socket
 * @returns Function must be executed in terms of client's response
 */
function requestAuth(sock) {
    return async (err, response) => {
        // if an error (access not authorized...) disconnect socket
        if (err) {
            emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
        } else {
            if (response.token !== undefined && response.sheetId !== undefined) {
                // verify auth token
                let data = await Tokens.verifyAuthToken(response.token);
                if (data.error !== undefined) {
                    emitReasonToDisconnect(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_REFUSED);
                } else {
                    let access = await UserAccessSheet.getAccessByPk(data.userID, response.sheetId);
                    // if user has access to sheet, he joins the room corresponding to sheet and a personnal room
                    if (access !== null) {
                        sock.join('sheet'+response.sheetId);
                        sock.join('user'+data.userID);
                        // confirm to client that connection is a success
                        SocketGestionnary.getInstance().emit(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.AUTH_SUCCESS);
                        SocketGestionnary.getInstance().emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.ALERT_ROOM_NEW_CONNECTION, {
                            userId: data.userID,
                            login: (await UserModel.getById(data.userID)).login
                        });
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

/**
 * Verify type corresponding to cell's coordinate in message's arg receive.
 * @param arg Arg received
 * @returns True if arg contains cell's coordinate 
 */
function verifyCellCoord(arg) {
    // we verify arg.line is an integer
    if (arg.line === undefined || typeof arg.line !== "number" || !Number.isInteger(arg.line)) {
        return false;
    }
    // we verify arg.column is a string with full capital letters
    if (arg.column === undefined || typeof arg.column !== "string" || !isCapitalWord(arg.column)) {
        return false;
    }
    return true;
}

/**
 * Function to verify arg who has received. True if arg contains cell's coordinate and his content.
 * @param arg Arg received
 * @returns True if arg contains cell's coordinate and his content.
 */
function writeCellChecker(arg) {
    // We verify arg is an object
    if (arg === undefined || typeof arg !== 'object' || Array.isArray(arg)) {
        return false;
    }
    if (!verifyCellCoord(arg)) {
        return false;
    }
    // We check if arg.content is a string.
    if (arg.content === undefined || typeof arg.content !== "string") {
        return false;
    }
    return true;
}

/**
 * Modify cell and emit the modification to other users in same room.
 * @param sock client's socket
 * @param arg  cell's coordinate and his content
 */
function writeCellEvent(sock, arg) {
    SocketGestionnary.getInstance().emitToSheetRoom(sock, SOCKET_PROTOCOL.MESSAGE_TYPE.TO_CLIENT.WRITE_CELL, arg);
}

export default SOCKET_PROTOCOL;