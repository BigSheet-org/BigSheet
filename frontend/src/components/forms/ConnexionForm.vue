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
            },
            loginFilled() {
                return this.login !== "" ? "filled" : "";
            }
        },
        components: {Input},
        methods: {
            changeLogin(newLogin) {
                this.login = newLogin;
                console.log("[DEBUG] - Changed login !")
            },
            changePassword(newPassword) {
                this.password = newPassword;
                console.log("[DEBUG] - Changed password !")
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
        <h1>Connexion</h1>

        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.text"
               :prefill="this.login"
               @changeField="(payload) => { this.changeLogin(payload) }"/>

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.password"
               :prefill="this.password"
               @changeField="(payload) => { this.changePassword(payload) }"/>

        <div class="submit">
            <button @click="this.loginUser()">
                Connexion
            </button>

            <router-link :to="Routes.INSCRIPTION.path">Pas encore de compte ?</router-link>
        </div>
    </div>
</template>
