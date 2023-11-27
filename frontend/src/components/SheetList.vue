<script>
import SheetItem from "./SheetItem.vue";

export default {
  components: {
    SheetItem
  },
  props: {
    sheets: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <div class="sheet-list">
    <h2>Feuilles de calcul récentes :</h2>
    <div style="overflow-y: auto; margin-right: 6vw; margin-left: 6vw; max-height: 47vh;">
      <ul>
        <sheet-item v-for="sheet in sheets" :key="sheet.name" :sheet="sheet"></sheet-item>
      </ul>
    </div>
  </div>
</template>