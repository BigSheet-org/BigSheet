<script>
import NavBar from "../components/navbar/NavBar.vue";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import LocalStorage from "../scripts/DAO/LocalStorage.js";

export default {
    components: {NavBar},
    methods: {
        sock() {
            const socket = io("http://localhost:8000", {
                transports: ['websocket']
            });
            socket.on("authReq", (arg, callback) => {
                callback({
                    token: LocalStorage.getAccessToken(),
                    sheetId: 2
                });
            });
            socket.on("authFail", (arg) => {
                console.log("disconnected");
            });
            socket.on("authOk", (arg) => {
                console.log("youhou");
            });
            socket.on("modifyCells", (arg) => {
                console.log(arg);
            });
        },
        sendRoom() {
            socket.emit("modifyCell", {a: 1, b: "yo"});
        }
    }
}

</script>

<template>
    <NavBar/>
    <h1>TestSocket</h1>
    <button @click="this.sock()">Test</button>
    <button @click="this.sendRoom()">Send</button>
</template>
