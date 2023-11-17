<script>
import Input from "./Input.vue";
import Data from "../../assets/static/Data.js";
import Routes from "../../assets/static/Routes.js";
import Loading from "../common/Loading.vue";

export default {
    computed: {
        Routes() { return Routes; },
        Data() { return Data; }
    },
    components: {Loading, Input},
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
        registerUser() {
            this.loading = true;
            setTimeout(() => { this.loading = false}, 2000)
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
            loading: false,
        }
    }
}
</script>

<template>
    <div class="form">
        <h1>Inscription</h1>

        <Input name="Nom"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.lastname"
               @changeField="this.changeLastname()" />
        <Input name="Prénom"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.firstname"
               @changeField="this.changeFirstname()" />
        <Input name="Adresse E-mail"
               :input-type="Data.INPUT_TYPES.MAIL"
               :prefill="this.mail"
               @changeField="this.changeMail()" />
        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.login"
               @changeField="this.changeLogin()" />

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :prefill="this.password"
               @changeField="this.changePassword()"/>
        <Input name="Confirmer le mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :prefill="this.confirmPassword"
               @changeField="this.changeConfirmPassword()"/>

        <div v-if="!this.loading"
             class="submit">
            <button @click="this.registerUser()">
                Inscription
            </button>

            <router-link :to="Routes.CONNEXION.path">Déjà un compte ?</router-link>
        </div>

        <Loading v-else/>
    </div>
</template>
