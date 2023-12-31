<script>
import SheetItem from "./SheetItem.vue";
import Sheets from "../../scripts/DAO/Sheets.js";
import Loading from "../common/Loading.vue";
import SlideAndFadeTransition from "../transitions/SlideAndFadeTransition.vue";
import Routes from "../../assets/static/Routes.js";

export default {
    computed: {
        Routes() { return Routes; }
    },
    data() {
        return {
            sheets: [],
            loading: false
        }
    },
    components: { SlideAndFadeTransition, Loading, SheetItem },
    methods: {
        async fetchSheets() {
            this.loading = true;
            this.sheets = await Sheets.getAllSheets();
            this.loading = false;
        },
        async createSheet() {
            await Sheets.createSheet({
                title: "TestTitle",
                detail: "TestDetail"
            })
        }
    },
    async beforeMount() {
        await this.fetchSheets();
    }
};
</script>

<template>
    <div>
        <div class="sheet_list">
            <h2>Vos feuilles de calcul :</h2>
            <div v-if="!this.loading" class="item_container">
                <SlideAndFadeTransition>
                    <ul v-if="this.sheets.length > 0">
                        <sheet-item v-for="sheet in sheets" :key="sheet.name" :sheet="sheet" />
                    </ul>
                    <div v-else>
                        Aucune feuille de calcul n'a été trouvée.
                    </div>
                </SlideAndFadeTransition>
            </div>
            <Loading v-else />
        </div>

        <router-link class="add_button"
                     :to="Routes.NOT_FOUND.path"
                     @click="this.createSheet">
            <img src="../../assets/pictures/icons/Ajouter.png" alt="Add">
        </router-link>
    </div>
</template>