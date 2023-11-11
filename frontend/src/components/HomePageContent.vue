<script>
import Routes from "../assets/static/Routes.js";
import User from "../scripts/DAO/User.js";

export default {
    computed: {
        Routes() {
            return Routes
        },
        CheckAuthentication() {
            return User.isUserConnected();
        }
    },
    methods: {

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
        <h1>Bienvenue !</h1>
    </div>
</template>
