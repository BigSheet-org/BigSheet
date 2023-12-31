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
import UserList from "../../scripts/Models/UserList.js";

export default {
    computed: {
        Formatters() {
            return Formatters
        }
    },
    components : {UpperBar, UserItem, SlideAndFadeTransition, Cell },

    data(){
        return {
            rowsNames : [],         // Name of the headers of rows.
            columnsNames : [],      // Name of the headers of columns.
            sheet : [],             // Tab containing each row of the sheet.
            cells : [],             // Tab containing all the cells, each cell can be accessed with her coords Ex : this.cells['A1'].
            cellsColors : [],       // Tab containing all the cells colors.
            modifyingUsers: [],     // Tab containing all the cells modifiers.
            locks: [],              // Tab containing all the cells locks.
            tableDimensions: 50,    // Dimension of the table.
            users: null,            // Users connected to this sheet.
            socket: null,           // Socket to share modifications between users.
            currentUserModel: new UserModel("", 0),  // Current user's model.
            currentCell: {
                id: "",
                content: ""
            },
            currentPermission: null
        };
    },

    async beforeMount() {
        this.users = new UserList();
        let connectedUser = await User.fetchUserData();
        this.currentUserModel = new UserModel(connectedUser.login, parseInt(connectedUser.id));
        this.users.addUser(this.currentUserModel);


        // We initialize the socket connexion for concurrent modification.
        if (this.$route.query.sheetID !== undefined && this.$route.query.sheetID !== null) {
            // We add the handlers for the sockets possible calls.
            let handlers = new SocketProtocols();
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.WRITE_CELL, this.handleCellChange);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_NEW_CONNECTION, this.handleUserConnect);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.ALERT_USER_DISCONNECT, this.handleUserDisconnect);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.USER_SELECT_CELL, this.handleSelectCell);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.LOAD_CELLS, this.handleCellLoad);
            handlers.addHandler(Data.SOCKET_PROTOCOLS_QUALIFIERS.AUTH_SUCCESS, this.handlePermissionSend);

            // We create the handler.
            this.socket = new SocketManager(this.$route.query.sheetID, handlers);
        }

        this.setRowNames(this.tableDimensions);
        this.setColumnsNames(this.tableDimensions);
        this.createSheet();
    },

    beforeUnmount() {
        // We close the socket when leaving. Just to be sure.
        this.socket.closeSocket();
    },

    methods:{
        // Generates the headers for the columns.
        setColumnsNames(nb) {
            for(let number = 1; number <= nb; number++){
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
                    this.cells[name + rowHead] = '';            // Allows to access cells with their coords.
                    this.cellsColors[name + rowHead] = '';      // Allows to access cellsColors with their coords.
                    this.modifyingUsers[name + rowHead] = null;      // Allows to access modifyingUsers with their coords.
                    this.locks[name + rowHead] = false;
                    row.push(name);
                });
                this.sheet.push(row);
            });
        },

        // Method called when data is changed inside a cell.
        changeValue(index, value) {
            this.cells[index] = value;
            this.currentCell = {
                id: index,
                content: value
            };
            // We notify to other users and to the server that the cell has changed value.
            this.socket.sendRoom(value);
        },

        // Method called when a cell is selected.
        selectCell(index) {
            // We reset the previous selected cell by the user.
            if (this.currentUserModel.lastCellSelected !== "") {
                this.cellsColors[this.currentUserModel.lastCellSelected] = '';
                this.modifyingUsers[this.currentUserModel.lastCellSelected] = null;
            }

            // We notify to other users and to the server that the cell is being selected.
            this.cellsColors[index] = this.currentUserModel.color;
            this.modifyingUsers[index] = this.currentUserModel;
            this.currentUserModel.lastCellSelected = index;
            this.currentCell = {
                id: index,
                content: this.cells[index]
            }

            this.socket.selectCell(index);
        },


        // ------------- [ SOCKET HANDLERS ] ------------- //
        // Method called when a cell is modified by a user.
        handleCellChange(payload) {
            this.cells[Formatters.formatColumnAndLinesToCellID(payload.column, payload.line)] = payload.content;
        },

        // Method called when a cell is modified by a user.
        handleSelectCell(payload) {
            let cellID = Formatters.formatColumnAndLinesToCellID(payload.cell.column, payload.cell.line)
            let userModifyingCell = this.users.getUser(payload.userId);

            // We reset the previous selected cell by the user.
            if (userModifyingCell.lastCellSelected !== "") {
                this.cellsColors[userModifyingCell.lastCellSelected] = '';
                this.modifyingUsers[userModifyingCell.lastCellSelected] = null;
                if (this.currentPermission !== "reader") {
                    this.locks[userModifyingCell.lastCellSelected] = false;
                }
            }

            // We change the color of the new cell.
            this.cellsColors[cellID] = userModifyingCell.color;
            this.modifyingUsers[cellID] = userModifyingCell;
            this.locks[cellID] = true;
            userModifyingCell.lastCellSelected = cellID;
        },

        // Method called when a user connects to the room.
        handleUserConnect(payload) {
            this.users.addUser(new UserModel(payload.login, payload.userId));
        },

        // Method called when a user disconnects from a room.
        handleUserDisconnect(payload) {
            let userModifyingCell = this.users.getUser(payload.userId);
            // We reset the last selected cell by the user.
            if (userModifyingCell.lastCellSelected !== "") {
                this.cellsColors[userModifyingCell.lastCellSelected] = '';
                this.modifyingUsers[userModifyingCell.lastCellSelected] = null;
                this.locks[userModifyingCell.lastCellSelected] = false;
            }

            // We remove the user from the list?
            this.users.removeUser(payload.userId);
        },

        // Method to call when cells have been loaded.
        handleCellLoad(payload) {
            for(let cellIndex in payload) {
                let cellID = Formatters.formatColumnAndLinesToCellID(
                    payload[cellIndex].column,
                    payload[cellIndex].line
                );
                this.cells[cellID] = payload[cellIndex].content;
            }
        },

        // Method to call for a permission registering.
        handlePermissionSend(payload) {
            this.currentPermission = payload;
            if (payload === "reader") {
                this.rowsNames.forEach(rowHead => {
                    this.columnsNames.forEach(name => {
                        this.locks[name + rowHead] = true;
                    });
                });
            }
        }
    }
}
</script>

<template>
    <div class="sheet">
        <UpperBar :current-cell="this.currentCell"
                  :users="this.users"
                  @valueChange="(cellID, payload) => { this.changeValue(cellID, payload); }"/>
        <SlideAndFadeTransition>
            <div class="table_container">
                <table>
                    <thead class="column-header">
                        <th></th>
                        <th v-for="name in this.columnsNames"
                            :class="{highlight: Formatters.extractColumnAndLinesFromColumnID(this.currentCell.id).column === name}">
                            {{name}}
                        </th>
                    </thead>
                    <tr v-for="(row, index) in this.sheet">
                        <th :class="{ highlight: Formatters.extractColumnAndLinesFromColumnID(this.currentCell.id).line === index + 1 }">
                            {{(index + 1)}}
                        </th>
                        <td v-for="cell in row">
                            <Cell :id="cell + (index + 1)"
                                  :prefill="this.cells[cell + (index + 1)]"
                                  :borderColor="this.cellsColors[cell + (index + 1)]"
                                  :modifying-user="this.modifyingUsers[cell + (index + 1)]"
                                  :lock-cell-modifications="this.locks[cell + (index + 1)]"
                                  @selectedCell="(cellID) => { this.selectCell(cellID); }"
                                  @valueChange="(cellID, payload) => { this.changeValue(cellID, payload); }"/>
                        </td>
                    </tr>
                </table>
            </div>
        </SlideAndFadeTransition>
    </div>
</template>