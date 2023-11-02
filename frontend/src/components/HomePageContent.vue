<script>
import Routes from "../assets/static/Routes.js";

export default {
    computed: {
        Routes() {
            return Routes
        }
    }

}
</script>

<template>
    <div>
        <h1>Veuillez vous authentifier pour continuer.</h1>
        <router-link :to="Routes.CONNEXION.path">
            <button>Connexion</button>
        </router-link>
        <router-link :to="Routes.INSCRIPTION.path">
            <button>Inscription</button>
        </router-link>
    </div>
</template>
