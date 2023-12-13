import { Server } from "socket.io";
import Tokens from "./Tokens.js";
import { UserAccessSheet } from "../../association/UserAccessSheet.js";

class SocketGestionnary {
   constructor(httpServ) {
       this.io=new Server(httpServ);
       this.io.on('connection', (sock) => {
            sock.timeout(5000).emit('auth', '', async (err, response) => {
                // if an error (access not autorized...) disconnect socket
                if (err) {
                    sock.disconnect();
                    console.log("err1");
                } else {
                    if (response.token !== undefined && response.sheetId !== undefined) {
                        let data = await Tokens.verifyAuthToken(response.token);
                        if (data.error !== undefined) {
                            sock.disconnect();
                            console.log("err2");
                        } else {
                            let access = await UserAccessSheet.getAccessByPk(data.userID, response.sheetId);
                            // if user has access to sheet, he joins the room corresponding to corresponding to sheet
                            if (access != null) {
                                sock.join('sheet'+response.sheetId);
                                console.log("ok");
                            } else {
                                sock.disconnect();
                                console.log("err3");
                            }                            
                        }
                    } else {
                        sock.disconnect();
                        console.log("err4");
                    }
                }
            });
       });
   }
}

export default SocketGestionnary;