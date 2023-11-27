<script>
import User from "../scripts/DAO/User.js";
import Routes from "../assets/static/Routes.js";
import SheetList from "./sheetlist/SheetList.vue";

export default {
    components: {
        SheetList
    },
    data() {
        return {
            user: null,
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
    },
    async beforeMount() {
        if (this.CheckAuthentication) {
            await this.fetchUserData();
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
        <h1>Bienvenue {{this.user.firstname}}</h1>
        <SheetList/>
    </div>
</template>