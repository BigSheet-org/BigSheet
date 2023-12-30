<script>
export default {
    props: {
        sheet: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showOptions: false,
        };
    },
    methods: {
        handleItemClick() {
            // TODO : Faire en sorte que ca redirige vers la page avec le bon tableau
        },
        deleteItem() {
            this.$emit('delete-sheet', this.sheet);
        }
    },
};
</script>

<template>
    <div class="sheet_item" @click="this.handleItemClick()">
        <div class="sheet_info">
            <h3>{{ sheet.title }}</h3>
            <p>Détails: {{ sheet.details }}</p>
            <p>Propriétaire: {{ sheet.owner }}</p>
            <button class="delete_button" @click.stop="deleteItem" title="Supprimer de la liste">
                <img src="../../assets/pictures/icons/Supprimer.png" alt="Delete">
            </button>
        </div>
    </div>
</template>
