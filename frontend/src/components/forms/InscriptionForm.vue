<script>
import Input from "./Input.vue";
import Data from "../../assets/static/Data.js";
import Routes from "../../assets/static/Routes.js";
import Loading from "../common/Loading.vue";
import Utils from "../../scripts/Utility/Utils.js";
import User from "../../scripts/DAO/User.js";
import router from "../../router/index.js";
import PopUp from "../common/PopUp.vue";

export default {
    computed: {
        Routes() { return Routes; },
        Data() { return Data; }
    },
    components: {PopUp, Loading, Input},
    methods: {
        changeField(payload, field) {
            this.user[field] = payload;
        },
        hideConfirmMessage() {
            this.showPopup = false;
            router.push(Routes.HOME.path)
        },
        resetFields() {
            for (let attribute in this.error) {
                this.error[attribute] = false
            }
            for (let attribute in this.correct) {
                this.correct[attribute] = false
            }
        },
        checkFields() {
            let canProceed = true;
            // We check if all fields are filled.
            for (let attribute in this.user) {
                if(this.user[attribute] === "" || this.user[attribute] === undefined) {
                    this.error[attribute] = true;
                    this.error_messages[attribute] = Data.MESSAGES.MANDATORY_FIELD;
                    canProceed = false;
                } else {
                    this.correct[attribute] = true;
                }
            }
            // Special checks
            // Passwords must match
            if (this.user.password !== this.user.confirmPassword) {
                this.error["password"] = true;
                this.error["confirmPassword"] = true;
                this.error_messages["confirmPassword"] = Data.MESSAGES.PASSWORD_DONT_MATCH;
                canProceed = false;
            }
            // Passwords must be secure enough
            if (!Utils.validatePassword(this.user.password)) {
                this.error["password"] = true;
                this.error_messages["password"] = Data.MESSAGES.PASSWORD_NOT_SECURE;
                canProceed = false;
            }
            // Mail must be correct
            if (!Utils.validateEmail(this.user.mail)) {
                this.error["mail"] = true;
                this.error_messages["mail"] = Data.MESSAGES.MAIL_INVALID;
                canProceed = false;
            }

            return canProceed
        },
        async registerUser() {
            this.loading = true;

            if (this.checkFields()) {
                let result = await User.registerUser(this.user);

                if (result.error_code) {
                    switch (result.error_message) {
                        case Data.MESSAGES.API_ANSWERS.LOGIN_ALREADY_USED:
                            this.error["login"] = true;
                            this.error_messages["login"] = Data.MESSAGES.LOGIN_ALREADY_USED;
                            break;

                        case Data.MESSAGES.API_ANSWERS.MAIL_ALREADY_USED:
                            this.error["mail"] = true;
                            this.error_messages["mail"] = Data.MESSAGES.MAIL_ALREADY_USED;
                            break;
                    }

                } else {
                    this.showPopup = true
                }
            }
            this.loading = false
        }
    },
    data(){
        return {
            user: {
                firstname: undefined,
                lastname: undefined,
                login: undefined,
                mail: undefined,
                password: undefined,
                confirmPassword: undefined
            },
            error: {
                firstname: false,
                lastname: false,
                login: false,
                mail: false,
                password: false,
                confirmPassword: false,
            },
            error_messages: {
                firstname: "",
                lastname: "",
                login: "",
                mail: "",
                password: "",
                confirmPassword: "",
            },
            correct: {
                firstname: false,
                lastname: false,
                login: false,
                mail: false,
                password: false,
                confirmPassword: false,
            },
            loading: false,
            showPopup: false,
        }
    }
}
</script>

<template>
    <div>
        <div class="form">
            <h1>Inscription</h1>

            <Input name="Prénom"
                   :input-type="Data.INPUT_TYPES.TEXT"
                   :prefill="this.user.firstname"
                   :error="this.error['firstname']"
                   :error_message="this.error_messages['firstname']"
                   :right="this.correct['firstname']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'firstname') }"/>

            <Input name="Nom"
                   :input-type="Data.INPUT_TYPES.TEXT"
                   :prefill="this.user.lastname"
                   :error="this.error['lastname']"
                   :error_message="this.error_messages['lastname']"
                   :right="this.correct['lastname']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'lastname') }"/>

            <Input name="Mail"
                   :input-type="Data.INPUT_TYPES.MAIL"
                   :prefill="this.user.mail"
                   :error="this.error['mail']"
                   :error_message="this.error_messages['mail']"
                   :right="this.correct['mail']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'mail') }"/>

            <Input name="Identifiant"
                   :input-type="Data.INPUT_TYPES.TEXT"
                   :prefill="this.user.login"
                   :error="this.error['login']"
                   :error_message="this.error_messages['login']"
                   :right="this.correct['login']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'login') }"/>

            <Input name="Mot de passe"
                   :input-type="Data.INPUT_TYPES.PASSWORD"
                   :error="this.error['password']"
                   :error_message="this.error_messages['password']"
                   :right="this.correct['password']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'password') }"/>

            <Input name="Confirmer le mot de passe"
                   :input-type="Data.INPUT_TYPES.PASSWORD"
                   :error="this.error['confirmPassword']"
                   :error_message="this.error_messages['confirmPassword']"
                   :right="this.correct['confirmPassword']"
                   @click="this.resetFields()"
                   @changeField="(payload) => { this.changeField(payload,'confirmPassword') }"/>

            <div v-if="!this.loading"
                 class="submit">
                <button class="is_left"
                        @click="this.registerUser()">
                    Inscription
                </button>

                <router-link class="is_right"
                             :to="Routes.CONNEXION.path">
                    Déjà un compte ?
                </router-link>
            </div>

            <Loading v-else/>
        </div>

        <PopUp v-if="this.showPopup"
               @dismiss="this.hideConfirmMessage()"
               popup_class="success"
               title="Votre compte a été créé !"
               message="Vous pouvez l'utiliser en vous connectant."/>
    </div>

</template>
