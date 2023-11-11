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
        changeFirstname() {

        },
        changeLastname() {

        },
        changeMail() {

        },
        changeLogin() {

        },
        changePassword() {

        },
        changeConfirmPassword() {

        },
        loginUser() {

        }
    },
    data(){
        return {
            firstname: "",
            lastname: "",
            mail: "",
            login: "",
            password: "",
            confirmPassword: "",
        }
    }
}
</script>

<template>
    <div class="form">
        <h1>Inscription</h1>

        <Input name="Nom"
               :input-type="Data.INPUT_TYPES.text"
               :prefill="this.lastname"
               @changeField="this.changeLastname()" />
        <Input name="Prénom"
               :input-type="Data.INPUT_TYPES.text"
               :prefill="this.firstname"
               @changeField="this.changeFirstname()" />
        <Input name="Adresse E-mail"
               :input-type="Data.INPUT_TYPES.mail"
               :prefill="this.mail"
               @changeField="this.changeMail()" />
        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.text"
               :prefill="this.login"
               @changeField="this.changeLogin()" />

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.password"
               :prefill="this.password"
               @changeField="this.changePassword()"/>
        <Input name="Confirmer le mot de passe"
               :input-type="Data.INPUT_TYPES.password"
               :prefill="this.confirmPassword"
               @changeField="this.changeConfirmPassword()"/>

        <div class="submit">
            <button @click="this.loginUser()">
                Inscription
            </button>

            <router-link :to="Routes.CONNEXION.path">Déjà un compte ?</router-link>
        </div>
    </div>
</template>
