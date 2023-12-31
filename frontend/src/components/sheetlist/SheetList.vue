<script>
import SheetItem from "./SheetItem.vue";
import Sheets from "../../scripts/DAO/Sheets.js";
import Loading from "../common/Loading.vue";
import SlideAndFadeTransition from "../transitions/SlideAndFadeTransition.vue";
import Routes from "../../assets/static/Routes.js";
import CreateSheetPopUp from "../common/CreateSheetPopUp.vue";

export default {
    computed: {
        Routes() { return Routes; }
    },
    data() {
        return {
            sheets: [],
            loading: false,
            createSheetVisible: false
        }
    },
    components: { SlideAndFadeTransition, Loading, SheetItem, CreateSheetPopUp },
    methods: {
        async fetchSheets() {
            this.loading = true;
            this.sheets = await Sheets.getAllSheets();
            this.loading = false;
        },
        async updateSheetList() {
            await this.fetchSheets();
        },
        async hideCreateDeletion(confirms) {
            if (confirms) {
                const newData = {
                    title: confirms.title || "New Sheet",
                    detail: confirms.details || "Some details"
                };
                const newSheet = await Sheets.createSheet(newData);
                this.$router.push({ name: Routes.SHEET.name, query: { id: newSheet.id } });
            }
            this.createSheetVisible = false;
        }
    },
    async beforeMount() {
        await this.fetchSheets();
    }
};
</script>

<template>
    <CreateSheetPopUp v-if="this.createSheetVisible" popup-class="error" :choice="true"
        @dismiss="this.hideCreateDeletion(false)" @confirm="this.hideCreateDeletion" title="Suppression du tableau."
        message="Cette action est irréversible. Souhaitez vous continuer ?" />

    <div>
        <div class="sheet_list">
            <h2>Vos feuilles de calcul :</h2>
            <div v-if="!this.loading" class="item_container">
                <SlideAndFadeTransition>
                    <ul v-if="this.sheets.length > 0">
                        <sheet-item v-for="sheet in sheets" :key="sheet.name" :sheet="sheet"
                            :updateSheetList="updateSheetList" />
                    </ul>
                    <div v-else>
                        Aucune feuille de calcul n'a été trouvée.
                    </div>
                </SlideAndFadeTransition>
            </div>
            <Loading v-else />
        </div>

        <div class="add_button" @click="createSheetVisible = true">
            <img src="../../assets/pictures/icons/Ajouter.png" alt="Add">
        </div>

    </div>
</template>