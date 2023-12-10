<script>

import Cell from "./Cell.vue"
import {createWebHashHistory} from "vue-router";

export default{
  components :{Cell},

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
    //Generate the headers for the columns
    setColumnsNames(nb){
      for(let number = 0; number < nb; number++){
        if(number<26){
          this.columnsNames.push(String.fromCharCode(number+97))
        }
        //If there is more 26 columns we use two letter as a header
        else{
          this.columnsNames.push(String.fromCharCode(Math.floor((number/26)+96))+String.fromCharCode((number%26)+97));
        }
      }
    },
    //Generate the headers for the rows
    setRowNames(nb){
      for(let number = 1; number < nb; number++){
        this.rowsNames.push(number);
      }
    },

    //Generate the sheet using the columns headers and the rows headers
    createSheet(){

      this.rowsNames.forEach(rowHead => {
        let row = []
        this.columnsNames.forEach(name => {
          this.cells[name + rowHead] = ''; //Allow to access cells with their coords
          row.push(name);
        });

        this.sheet.push(row);
      });

  }
      }

}
</script>

<template>
  <table>
    <thead class="column-header">
    <th></th>
    <th v-for="name in this.columnsNames">{{name}}</th>
    </thead>
    <tr v-for="(row, index) in this.sheet">
      <th class="row-header">{{index+1}}</th>
      <td v-for="cell in row">
        <input v-model="this.cells[cell+index]" type="text">
      </td>
    </tr>
  </table>
</template>