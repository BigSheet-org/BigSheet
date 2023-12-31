<script>
import PopUp from "../common/PopUp.vue";
import SharePopUp from "../common/SharePopUp.vue";

import Sheets from "../../scripts/DAO/Sheets.js";
import router from "../../router/index.js";
import Routes from "../../assets/static/Routes.js";
import Formatters from "../../scripts/Utility/Formatters.js";
import User from "../../scripts/DAO/User.js";

export default {
    computed: {
        Formatters() {
            return Formatters
        }
    },
    props: {
        sheet: {
            type: Object,
            required: true
        },
        updateSheetList: {
            type: Function,
            required: true
        }
    },
    components: {
        PopUp,
        SharePopUp
    },
    data() {
        return {
            askDeletionConfirm: false,
            shareModalVisible: false,
            connectedUser: null,
        }
    },
    methods: {
        handleItemClick() {
            router.push({
                name: Routes.SHEET.name,
                query: { sheetID: this.sheet.id }
            });
        },
        async hideConfirmDeletion(confirms) {
            if (confirms) {
                await Sheets.deleteSheet(this.sheet.id);
                this.updateSheetList();
            }
            this.askDeletionConfirm = false;
        },
        isOwner() {
            return this.connectedUser.id === this.sheet.users[0].id;
        }
    },
    async beforeMount() {
        this.connectedUser = await User.fetchUserData();
    }
};
</script>

<template>
    <SharePopUp :isVisible="shareModalVisible" @dismiss="shareModalVisible = false"  :concerned-sheet="this.sheet.id"/>

    <PopUp v-if="this.askDeletionConfirm" popup-class="error" :choice="true" @dismiss="this.hideConfirmDeletion(false)"
        @confirm="this.hideConfirmDeletion(true)" title="Suppression du tableau."
        message="Cette action est irréversible. Souhaitez vous continuer ?" />

    <div class="sheet_item" @click="this.handleItemClick()">
        <div class="sheet_info">
            <h3>{{ sheet.title }}</h3>
            <p v-if="sheet.detail !== null">Détails : {{ sheet.detail }}</p>
            <p v-else>Détails : Aucun détails</p>
            <p>Propriétaire : {{ sheet.users[0].login }}</p>
            <p>Feuille créée le : {{ Formatters.formatDate(sheet.createdAt) }}</p>
            <div class="button_container" v-if="this.isOwner()">
                <div class="dropdown" @click.stop>
                    <div class="dots">
                        <img src="../../assets/pictures/icons/Dots.png" alt="Dots">
                    </div>
                    <div class="dropdown-content">
                        <button class="button_dropdown" 
                            @click.stop="shareModalVisible = true">Partager</button>
                        <button class="button_dropdown"
                            @click.stop="askDeletionConfirm = true">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
