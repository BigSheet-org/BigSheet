<script>
    import User from "../../scripts/DAO/User.js";
    import Input from "./Input.vue";
    import Data from "../../assets/static/Data.js";
    import Utils from "../../scripts/Utility/Utils.js";
    import Loading from "../common/Loading.vue";
    import ErrorForDisplay from "../../scripts/ErrorForDisplay.js";
    import PopUp from "../common/PopUp.vue";

    export default {
        computed: {
            Data() {
                return Data
            }
        },
        components: {PopUp, Loading, Input},
        data(){
            return {
                oldUser: undefined,
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
                error_message: {
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
                showPopup: true,
                askDeletionConfirm: false,
                confirmChangesApplied: false,
            }
        },
        methods: {
            async fetchUserData(){
                this.loading = true;
                this.user = await User.fetchUserData();
                this.oldUser = { ...this.user };        // We make a copy of the values. CAREFUL : it's not a deep copy.
                this.loading = false;
            },
            changeField(payload, field) {
                this.user[field] = payload;
                // We check the field's validity.
                // -> Mail formatting.
                if (field === "mail" && payload !== "") {
                    if (!Utils.validateEmail(this.user.mail)) {
                        this.error[field] = true;
                        this.error_message[field] = Data.MESSAGES.MAIL_INVALID;
                    } else {
                        this.correct[field] = true;
                        this.error[field] = false;
                        this.error_message[field] = "";
                    }
                }
                // -> Password.
                if (field === "password" && payload !== "") {
                    if (!Utils.validatePassword(this.user.password)) {
                        this.error[field] = true;
                        this.error_message[field] = Data.MESSAGES.PASSWORD_NOT_SECURE;
                    } else {
                        this.correct[field] = true;
                        this.error[field] = false;
                        this.error_message[field] = "";
                    }
                }
                // -> Confirm password.
                if (field === "confirmPassword" && payload !== "") {
                    if (this.user.password !== payload) {
                        this.error[field] = true;
                        this.error_message[field] = Data.MESSAGES.PASSWORD_DONT_MATCH;
                    } else {
                        this.correct[field] = true;
                        this.error[field] = false;
                        this.error_message[field] = "";
                    }
                }
            },
            async submitChanges() {
                this.loading = true;
                // Detecting and trying to submit changes.
                if (this.oldUser.login !== this.user.login
                    || this.oldUser.mail !== this.user.mail
                    || this.oldUser.firstname !== this.user.firstname
                    || this.oldUser.lastname !== this.user.lastname
                    || this.user.password && this.user.confirmPassword
                    ) {
                    let result = await User.modifyUser(this.oldUser, this.user);
                    if (result instanceof ErrorForDisplay) {
                        switch (result.error_message) {
                            case Data.MESSAGES.API_ANSWERS.MAIL_ALREADY_USED :
                                this.error['mail'] = true;
                                this.error_message['mail'] = Data.MESSAGES.MAIL_ALREADY_USED;
                                break;
                            case Data.MESSAGES.API_ANSWERS.LOGIN_ALREADY_USED :
                                this.error['login'] = true;
                                this.error_message['login'] = Data.MESSAGES.LOGIN_ALREADY_USED;
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.confirmChangesApplied = true;
                    }
                }

                this.loading = false;
            },
            async cancel() {
                Utils.resetErrorAndCorrectValues(this.error, this.error_message, this.correct)
                await this.fetchUserData();
            },
            hideConfirmChangesMessage() { this.confirmChangesApplied = false; }
        },
        async beforeMount() {
            await this.fetchUserData()
        }
    }

</script>

<template>
    <div class="form">
        <h1>Mon compte</h1>

        <Input name="Prénom"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.user.firstname"
               :error="this.error['firstname']"
               :error_message="this.error_message['firstname']"
               :right="this.correct['firstname']"
               @changeField="(payload) => { this.changeField(payload,'firstname') }"/>

        <Input name="Nom"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.user.lastname"
               :error="this.error['lastname']"
               :error_message="this.error_message['lastname']"
               :right="this.correct['lastname']"
               @changeField="(payload) => { this.changeField(payload,'lastname') }"/>

        <Input name="Mail"
               :input-type="Data.INPUT_TYPES.MAIL"
               :prefill="this.user.mail"
               :error="this.error['mail']"
               :error_message="this.error_message['mail']"
               :right="this.correct['mail']"
               @changeField="(payload) => { this.changeField(payload,'mail') }"/>

        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.user.login"
               :error="this.error['login']"
               :error_message="this.error_message['login']"
               :right="this.correct['login']"
               @changeField="(payload) => { this.changeField(payload,'login') }"/>

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :error="this.error['password']"
               :error_message="this.error_message['password']"
               :right="this.correct['password']"
               @changeField="(payload) => { this.changeField(payload,'password') }"/>

        <Input name="Confirmer le mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :error="this.error['confirmPassword']"
               :error_message="this.error_message['confirmPassword']"
               :right="this.correct['confirmPassword']"
               @changeField="(payload) => { this.changeField(payload,'confirmPassword') }"/>

        <div v-if="!this.loading"
             class="submit">
            <button class="is_left"
                    @click="this.submitChanges()">
                Enregistrer
            </button>
            <button class="is_right"
                    @click="this.cancel()">
                Annuler
            </button>
        </div>

        <Loading v-else/>

        <PopUp v-if="this.askDeletionConfirm"
               title="Attention"
               message="Cette action supprimera votre compte. Cette action est irréversible."/>

        <PopUp v-if="this.confirmChangesApplied"
               @dismiss="this.hideConfirmChangesMessage()"
               popup-class="success"
               title="Information"
               message="Vos données ont bien été modifiées."/>
    </div>

</template>
