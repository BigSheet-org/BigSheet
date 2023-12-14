<script>
export default {
    props: {
        sheet: {
            type: Array,
            required: true,
        },
    },
    methods: {
        handleItemClick() {
            //Faire en sorte que ca redirige vers la page avec le bon tableau
        },
    },
};
</script>

<template>
    <div class="sheet_item"
         @click="this.handleItemClick()">
        <div class="sheet_info">
            <h3>{{ sheet.title }}</h3>
            <p>Détails: {{ sheet.details }}</p>
            <p>Propriétaire: {{ sheet.owner }}</p>
        </div>
    </div>
</template>
