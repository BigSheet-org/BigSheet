<script>
    import Input from "./Input.vue";
    import Data from "../../assets/static/Data.js";
    import routes from "../../assets/static/Routes.js";
    import Loading from "../common/Loading.vue";
    import User from "../../scripts/DAO/User.js";
    import ErrorForDisplay from "../../scripts/ErrorForDisplay.js";
    import router from "../../router/index.js";

    export default {
        computed: {
            Routes() { return routes },
            Data() {
                return Data
            },
            loginFilled() {
                return this.login !== "" ? "filled" : "";
            }
        },
        components: {Loading, Input},
        methods: {
            checkFields() {

                if (this.login === "") {

                }
                if (this.password === "") {

                }
                // We check if the fields are not empty
                return !(this.login === "" || this.password === "");
            },
            resetFields() {
                this.error = false;
            },
            changeLogin(newLogin) {
                this.login = newLogin;
            },
            changePassword(newPassword) {
                this.password = newPassword;
            },
            async loginUser() {
                this.loading = true;

                // Ensuring the fields are correctly filled.
                let proceed = this.checkFields();

                if(proceed) {
                    let result = await User.connectUser(this.login, this.password)
                    if(result instanceof ErrorForDisplay) {
                        this.error = true;
                        this.error_message = result.error_message;
                    } else {
                        this.loginStatus = true;
                        setTimeout(
                            () => { router.push(Routes.HOME.path)},
                            Data.PROGRAM_VALUES.TIMEOUT_BEFORE_REDIRECT
                        )
                    }
                }
                this.loading = false;
            }
        },
        data(){
            return {
                login: "",
                password: "",
                loading: false,
                error: false,
                error_message: "",
                loginStatus: false,
            }
        }
    }
</script>

<template>
    <div class="form">
        <h1>Connexion</h1>

        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.login"
               :error="this.error"
               :right="this.loginStatus"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeLogin(payload) }"/>

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :prefill="this.password"
               :error="this.error"
               :right="this.loginStatus"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changePassword(payload) }"/>

        <div class="error"
             v-if="this.error">
            {{ this.error_message }}
        </div>


        <div v-if="!this.loading"
             class="submit">
            <button @click="this.loginUser()">
                Connexion
            </button>

            <router-link :to="Routes['inscription'].path">Pas encore de compte ?</router-link>
        </div>

        <Loading v-else/>

    </div>
</template>
