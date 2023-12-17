<script>

import Cell from "./Cell.vue"
import SlideAndFadeTransition from "../transitions/SlideAndFadeTransition.vue";
import Formatters from "../../scripts/Utility/Formatters.js";

export default {
    components :{SlideAndFadeTransition, Cell},

    data(){
        return {
            rowsNames : [], //Name of the headers of rows
            columnsNames : [], //Name of the headers of columns
            sheet : [], //Tab containing each row of the sheet
            cells : [] //Tab containing all the cells, each cell can be accessed with her coords Ex : this.cells['a0']
        };
     },

    beforeMount(){
        this.setRowNames(50);
        this.setColumnsNames(50);
        this.createSheet();
    },

    methods:{
        // Generates the headers for the columns
        setColumnsNames(nb) {
            for(let number = 1; number < nb; number++){
                this.columnsNames.push(
                    Formatters.convertToColumnLabel(number)
                );
            }
        },
        //Generates the headers for the rows
        setRowNames(nb) {
            for (let number = 1; number <= nb; number++){
                this.rowsNames.push(number);
            }
        },

        //Generates the sheet using the columns headers and the rows headers
        createSheet() {
            this.rowsNames.forEach(rowHead => {
                let row = []
                this.columnsNames.forEach(name => {
                    this.cells[name + rowHead] = ''; //Allow to access cells with their coords
                    row.push(name);
                });
                this.sheet.push(row);
            });
        },

        changeValue(index, value) {
            console.log("[INFO] - Cell with id " + index + " has changed value to " + value);
            this.cells[index] = value;
        }
    }
}
</script>

<template>
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