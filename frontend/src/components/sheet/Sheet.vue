<script>

import Cell from "./Cell.vue"
import SlideAndFadeTransition from "../transitions/SlideAndFadeTransition.vue";
import Formatters from "../../scripts/Utility/Formatters.js";
import SocketManager from "../../scripts/DAO/SocketManager.js";
import SocketProtocols from "../../scripts/DAO/SocketProtocols.js";
import Data from "../../assets/static/Data.js";
import UserItem from "./UserItem.vue";
import UpperBar from "./UpperBar.vue";
import User from "../../scripts/DAO/User.js";
import UserModel from "../../scripts/Models/UserModel.js"

export default {
    components : {UpperBar, UserItem, SlideAndFadeTransition, Cell },

    data(){
        return {
            rowsNames : [],         // Name of the headers of rows
            columnsNames : [],      // Name of the headers of columns
            sheet : [],             // Tab containing each row of the sheet
            cells : [],             // Tab containing all the cells, each cell can be accessed with her coords Ex : this.cells['a0']
            tableDimensions: 50,    // Dimension of the table.
            users: [],              // Users connected to this sheet.
            socket: null
        };
    },

    async beforeMount() {
        this.setRowNames(this.tableDimensions);
        this.setColumnsNames(this.tableDimensions);
        this.createSheet();

        // We initialize the socket connexion for concurrent modification.
        if (this.$route.query.sheetID !== undefined && this.$route.query.sheetID !== null) {
            // We add the handlers for the sockets possible calls.
            let handlers = new SocketProtocols();
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL, this.handleCellChange);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_NEW_CONNECTION, this.handleUserConnect);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_USER_DISCONNECT, this.handleUserDisconnect);

            // We create the handler.
            this.socket = new SocketManager(this.$route.query.sheetID, handlers);
        }
        let connectedUser = await User.fetchUserData();
        this.users.push(new UserModel(connectedUser.login))
        this.users.push(new UserModel("Elisa"))
        this.users.push(new UserModel("Test"))

        setTimeout(() => this.users.push(new UserModel("A")), 3000)
        setTimeout(() => this.users.pop(), 6000)
    },

    methods:{
        // Generates the headers for the columns.
        setColumnsNames(nb) {
            for(let number = 1; number < nb; number++){
                this.columnsNames.push(Formatters.convertToColumnLabel(number));
            }
        },
        // Generates the headers for the rows.
        setRowNames(nb) {
            for (let number = 1; number <= nb; number++){
                this.rowsNames.push(number);
            }
        },

        // Generates the sheet using the columns headers and the rows headers.
        createSheet() {
            this.rowsNames.forEach(rowHead => {
                let row = []
                this.columnsNames.forEach(name => {
                    this.cells[name + rowHead] = '';    // Allows to access cells with their coords.
                    row.push(name);
                });
                this.sheet.push(row);
            });
        },

        // Method called when data is changed inside a cell.
        changeValue(index, value) {
            console.log("[INFO] - Cell with id " + index + " has changed value to " + value);
            this.cells[index] = value;

            // We notify to other users and to the server that the cell has changed value.
            this.socket.sendRoom(index, value);
        },


        // ------------- [ SOCKET HANDLERS ] ------------- //
        // Method called when a cell is modified by a user.
        handleCellChange(cellID, payload) {
            console.log("[INFO] - Cell with id " + cellID + " has changed remotely been changed to " + payload);
        },

        // Method called when a user connects to the room.
        handleUserConnect(payload) {
            console.log("[INFO] - A user joined ! Payload : " + payload);
        },

        // Method called when a user disconnects from a room.
        handleUserDisconnect(payload) {
            console.log("[INFO] - A user left ! Payload : " + payload);
        }
    }
}
</script>

<template>
    <UpperBar :users="this.users"/>
    <SlideAndFadeTransition>
        <table>
            <thead class="column-header">
                <th></th>
                <th v-for="name in this.columnsNames">{{name}}</th>
            </thead>
            <tr v-for="(row, index) in this.sheet">
                <th class="row-header">{{(index + 1)}}</th>
                <td v-for="cell in row">
                    <Cell :id="cell + (index + 1)"
                          :prefill="this.cells[cell + (index + 1)]"
                          @valueChange="(index, payload) => { this.changeValue(index, payload); }"/>
                </td>
            </tr>
        </table>
    </SlideAndFadeTransition>
</template>