<script>
import User from "../scripts/DAO/User.js";
import routes from "../assets/static/Routes.js";

export default {
    data() {
        return {
            user: null,
        }
    },
    computed: {
        Routes() { return routes },
        CheckAuthentication() { return User.isUserConnected(); }
    },
    methods: {
        async fetchUserData() {
            this.user = await User.fetchUserData();
        }
    },
    beforeMount() {
        if (this.CheckAuthentication) {
            this.fetchUserData();
        }
    }

}
</script>

<template>
    <div v-if="!this.CheckAuthentication">
        <h1>Veuillez vous authentifier pour continuer.</h1>
        <router-link :to="Routes['connexion'].path">
            <button>Connexion</button>
        </router-link>
        <router-link :to="Routes['inscription'].path">
            <button>Inscription</button>
        </router-link>
    </div>

    <div v-else>
        <h1>Bienvenue {{user !== null ? user.firstname : "" }} !</h1>
    </div>
</template>
