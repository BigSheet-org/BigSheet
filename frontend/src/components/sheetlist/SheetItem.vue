<script>
import PopUp from "../common/PopUp.vue";

export default {
    props: {
        sheet: {
            type: Object,
            required: true,
        },
    },
    components: {
        PopUp
    },
    data() {
        return {
            askDeletionConfirm: false
        }
    },
    methods: {
        handleItemClick() {
            // TODO : Faire en sorte que ca redirige vers la page avec le bon tableau
        },
        editItem() {

        },
        removeItem() {
            this.$emit('remove-sheet', this.sheet);
        },
        async hideConfirmDeletion(confirms) {
            if (confirms) {
                //TODO
            }
            this.askDeletionConfirm = false;
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
            <div class="button_container">
                <div class="dropdown" @click.stop>
                    <div class="dots">
                        <img src="../../assets/pictures/icons/Dots.png">
                    </div>
                    <div class="dropdown-content">
                        <a @click="editItem">Gérer</a>
                        <a @click="this.askDeletionConfirm = true;">Supprimer</a>
                    </div>
                </div>
                <button class="remove_button" @click="removeItem" title="Retirer de la liste">
                    <img src="../../assets/pictures/icons/Supprimer.png" alt="Remove">
                </button>
            </div>
        </div>

        <PopUp v-if="this.askDeletionConfirm" popup-class="error" :choice="true" @dismiss="this.hideConfirmDeletion(false)"
            @confirm="this.hideConfirmDeletion(true)" title="Suppression du tableau."
            message="Cette action est irréversible. Souhaitez vous continuer ?" />

    </div>
</template>
