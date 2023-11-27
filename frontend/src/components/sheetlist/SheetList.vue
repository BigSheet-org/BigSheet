<script>
import SheetItem from "./SheetItem.vue";
import Sheets from "../../scripts/DAO/Sheets.js";
import User from "../../scripts/DAO/User.js";
import Loading from "../common/Loading.vue";
import SlideAndFadeTransition from "../transitions/SlideAndFadeTransition.vue";

export default {
    data() {
        return {
            sheets: [],
            loading: false,
        }
    },
    components: {SlideAndFadeTransition, Loading, SheetItem },
    methods: {
        async fetchSheets() {
            this.loading = true;
            this.sheets = await Sheets.getOwnedSheets();
            this.loading = false;
        },
    },
    async beforeMount() {
        await this.fetchSheets();
    }
};
</script>

<template>
    <div class="sheet_list">
        <h2>Vos feuilles de calcul :</h2>
        <div v-if="!this.loading"
             class="item_container">
            <SlideAndFadeTransition>
                <ul v-if="this.sheets.length > 0">
                    <sheet-item v-for="sheet in sheets"
                                :key="sheet.name"
                                :sheet="sheet"/>
                </ul>
                <div v-else>
                    Aucune feuille de calcul n'a été trouvée.
                </div>
            </SlideAndFadeTransition>
        </div>
        <Loading v-else/>
    </div>
</template>