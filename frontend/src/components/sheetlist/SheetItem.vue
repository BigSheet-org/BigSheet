<script>
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
            required: true
        },
    },
    methods: {
        handleItemClick() {
            router.push({
                name: Routes.SHEET.name,
                query: { sheetID: this.sheet.id }
            });
        },
    },
};
</script>

<template>
    <div class="sheet_item"
         @click="this.handleItemClick()">
        <div class="sheet_info">
            <h3>{{ sheet.title }}</h3>
            <p v-if="sheet.detail !== null">Détails : {{ sheet.detail }}</p>
            <p v-else>Détails : Aucun détails</p>
            <p>Propriétaire : {{ sheet.users[0].login }}</p>
            <p>Feuille créée le : {{ Formatters.formatDate(sheet.createdAt) }}</p>
        </div>
    </div>
</template>
