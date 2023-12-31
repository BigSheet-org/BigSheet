<script>
import PopUp from "../common/PopUp.vue";
import SharePopUp from "../common/SharePopUp.vue";

import router from "../../router/index.js";
import Routes from "../../assets/static/Routes.js";
import Formatters from "../../scripts/Utility/Formatters.js";

export default {
    computed: {
        Formatters() {
            return Formatters
        }
    },
    props: {
        sheet: {
            type: Object,
            required: true,
        },
    },
    components: {
        PopUp,
        SharePopUp
    },
    data() {
        return {
            askDeletionConfirm: false,
            shareModalVisible: false
        }
    },
    methods: {
        isOwner() {
            //TODO
        },
        handleItemClick() {
            router.push({
                name: Routes.SHEET.name,
                query: { sheetID: this.sheet.id }
            });
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
            <p v-if="sheet.detail !== null">Détails : {{ sheet.detail }}</p>
            <p v-else>Détails : Aucun détails</p>
            <p>Propriétaire : {{ sheet.users[0].login }}</p>
            <p>Feuille créée le : {{ Formatters.formatDate(sheet.createdAt) }}</p>
            <div class="button_container">
                <div class="dropdown" @click.stop>
                    <div class="dots">
                        <img src="../../assets/pictures/icons/Dots.png" alt="Dots">
                    </div>
                    <div class="dropdown-content">
                        <button class="button_dropdown"
                                @click="shareModalVisible = true">Partager</button>
                        <button class="button_dropdown"
                                :disabled="!isOwner"
                                @click="askDeletionConfirm = true">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>

        <SharePopUp :isVisible="shareModalVisible"
                    @dismiss="shareModalVisible = false" />

        <PopUp v-if="this.askDeletionConfirm"
               popup-class="error"
               :choice="true"
               @dismiss="this.hideConfirmDeletion(false)"
               @confirm="this.hideConfirmDeletion(true)"
               title="Suppression du tableau."
               message="Cette action est irréversible. Souhaitez vous continuer ?" />

    </div>
</template>
