<script>
export default {
  props: {
    sheet: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleItemClick() {
      //Faire en sorte que ca redirige vers la page avec le bon tableau
    },
    handleMouseOver() {
      this.$refs.sheetItem.style.backgroundColor = "#e6e6e6";
    },
    handleMouseLeave() {
      this.$refs.sheetItem.style.backgroundColor = "transparent";
    },
  },
};
</script>

<template>
  <div class="sheet-item" @click="handleItemClick" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"
    ref="sheetItem">
    <div class="sheet-info">
      <h3>{{ sheet.name }}</h3>
      <p>Détails: {{ sheet.details }}</p>
      <p>Propriétaire: {{ sheet.owner }}</p>
    </div>
  </div>
</template>

  
<style scoped>
.sheet-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #878585;
  transition: background-color 0.3s;
}

.sheet-item:hover {
  background-color: #12b45b;
}

.sheet-info {
  display: flex;
  justify-content: space-between;
}
</style>