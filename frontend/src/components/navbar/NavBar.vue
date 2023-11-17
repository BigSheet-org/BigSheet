<script>
import routes from "../../assets/static/Routes.js";
import User from "../../scripts/DAO/User.js";

export default {
    computed: {
        Routes() { return routes },
        CheckAuthentication() { return User.isUserConnected(); }
    },
    components:{},
    props:{},
    methods:{
        async logout() {
            await User.logout();
        }
    },
}
</script>

<template>
    <div class="navbar_container">
        <div class="title">
            <router-link :to="Routes.HOME.path">
                <img src="../../assets/pictures/Logo_webpage.png" alt="BigSheet logo">
            </router-link>
            <h1>BigSheet</h1>

        </div>

        <div class="buttons" v-if="!this.CheckAuthentication">
            <router-link :to="Routes.INSCRIPTION.path">
                <button>Inscription</button>
            </router-link>
            <router-link :to="Routes.CONNEXION.path">
                <button>Connexion</button>
            </router-link>
        </div>

        <div class="buttons" v-else>
            <router-link :to="Routes['compte'].path">
                <button>Mon compte</button>
            </router-link>
            <button @click="this.logout()">
                Déconnexion
            </button>
        </div>
    </div>
</template>