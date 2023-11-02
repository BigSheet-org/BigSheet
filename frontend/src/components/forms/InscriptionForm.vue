<script>
import Input from "./Input.vue";
import Data from "../../assets/static/Data.js";
import Routes from "../../assets/static/Routes.js";

export default {
    computed: {
        Routes() {
            return Routes
        },
        Data() {
            return Data
        }
    },
    components: {Input},
    methods: {
        changeLogin() {

        },
        changePassword() {

        },
        loginUser() {

        }
    },
    data(){
        return {
            login: "",
            password: ""
        }
    }
}
</script>

<template>
    <div class="form">
        <h1>Inscription</h1>

        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.text"
               :prefill="this.login"
               @changeField="this.changeLogin()" />

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.password"
               :prefill="this.password"
               @changeField="this.changePassword()"/>

        <div class="submit">
            <button @click="this.loginUser()">
                Inscription
            </button>

            <router-link :to="Routes.CONNEXION.path">Déjà un compte ?</router-link>
        </div>
    </div>
</template>
