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
    <div v-if="!this.CheckAuthentication" >
        <h1>Veuillez vous authentifier pour continuer.</h1>
        <div class="homepage_content">
            <router-link :to="Routes.CONNEXION.path" class="align_left">
                <button>Connexion</button>
            </router-link>
            <router-link :to="Routes.INSCRIPTION.path" class="align_right">
                <button>Inscription</button>
            </router-link>
        </div>
    </div>

    <div v-else>
        <h1>Bienvenue {{user !== null ? user.firstname : "" }} !</h1>
        <SheetList/>
    </div>
</template>