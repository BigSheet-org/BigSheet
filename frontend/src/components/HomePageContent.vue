<script>
import User from "../scripts/DAO/User.js";
import Sheets from "../scripts/DAO/Sheets.js"
import Routes from "../assets/static/Routes.js";
import SheetList from "./SheetList.vue";

export default {
    components: {
        SheetList
    },
    data() {
        return {
            user: null,
            sheets: [],
        }
    },
    computed: {
        Routes() { return Routes; },
        CheckAuthentication() { return User.isUserConnected(); }
    },
    methods: {
        async fetchUserData() {
            this.user = await User.fetchUserData();
        },
        async fetchSheets() {
            this.sheets = await Sheets.getOwnedSheets();
        },
    },
    beforeMount() {
        if (this.CheckAuthentication) {
            this.fetchUserData();
            this.fetchSheets();
        }
    }

}
</script>

<template>
    <div v-if="!this.CheckAuthentication">
        <h1>Veuillez vous authentifier pour continuer.</h1>
        <router-link :to="Routes.CONNEXION.path">
            <button>Connexion</button>
        </router-link>
        <router-link :to="Routes.INSCRIPTION.path">
            <button>Inscription</button>
        </router-link>
    </div>

    <div v-else>
        <h1>Bienvenue</h1>
        <div v-if="sheets.length > 0">
            <sheet-list :sheets="sheets"></sheet-list>
        </div>
        <div v-else>
            <p>Vous n'avez pas encore créé de feuilles de calcul.</p>
        </div>
        <!--<router-link>-->
        <button style="position: fixed; right: 1.1rem; bottom: 1.3rem; border-radius: 50%;">
            +
            <!--<img src="../assets/pictures/icons/Ajouter.png" alt="Créer un nouveau tableau">-->
        </button>
        <!--</router-link>-->
    </div>
</template>