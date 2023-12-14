<script>
import NavBar from "../components/navbar/NavBar.vue";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

export default {
    components: {NavBar},
    methods: {
        sock() {
            const socket = io("http://localhost:8000", {
                transports: ['websocket']
            });
            socket.on("authReq", (arg, callback) => {
                callback({
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IERlYyAxNCAyMDIzIDE4OjE0OjQ2IEdNVCswMTAwIChoZXVyZSBub3JtYWxlIGTigJlFdXJvcGUgY2VudHJhbGUpIiwidXNlcklEIjoxLCJpYXQiOjE3MDI1NzQwODYsImV4cCI6MTcwMjYxMDA4Nn0.eVEPbW13fgJ3Qynkxe9pmZySjzghtMituCDYPFsHDXc",
                    sheetId: 3
                });
            });
            socket.on("authFail", (arg) => {
                console.log("disconnected");
            });
            socket.on("authOk", (arg) => {
                console.log("youhou");
            });
        }
    }
}

</script>

<template>
    <NavBar/>
    <h1>TestSocket</h1>
    <button @click="this.sock()">Test</button>
</template>
