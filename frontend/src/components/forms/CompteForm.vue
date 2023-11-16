<script>
    import User from "../../scripts/DAO/User.js";
    import Input from "./Input.vue";
    import Data from "../../assets/static/Data.js";

    export default {
        computed: {
            Data() {
                return Data
            }
        },
        components: {Input},
        data(){
            return {
                user: {},
                error: {
                    firstname: false,
                    lastname: false,
                    login: false,
                    mail: false,
                    password: false,
                    confirmPassword: false,
                },
                correct: {
                    firstname: false,
                    lastname: false,
                    login: false,
                    mail: false,
                    password: false,
                    confirmPassword: false,
                },
                loading: false
            }
        },
        methods: {
            async fetchUserData(){
                this.user = await User.fetchUserData()
            },
            changeField(payload, field) { this.user[field] = payload },
            resetFields() {

            },
            submitChanges() {

            }
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
               :right="this.correct['firstname']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'firstname') }"/>

        <Input name="Nom"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.user.lastname"
               :error="this.error['lastname']"
               :right="this.correct['lastname']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'lastname') }"/>

        <Input name="Mail"
               :input-type="Data.INPUT_TYPES.MAIL"
               :prefill="this.user.mail"
               :error="this.error['mail']"
               :right="this.correct['mail']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'mail') }"/>

        <Input name="Identifiant"
               :input-type="Data.INPUT_TYPES.TEXT"
               :prefill="this.user.login"
               :error="this.error['login']"
               :right="this.correct['login']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'login') }"/>

        <Input name="Mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :error="this.error['password']"
               :right="this.correct['password']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'password') }"/>

        <Input name="Confirmer le mot de passe"
               :input-type="Data.INPUT_TYPES.PASSWORD"
               :error="this.error['confirmPassword']"
               :right="this.correct['confirmPassword']"
               @click="this.resetFields()"
               @changeField="(payload) => { this.changeField(payload,'confirmPassword') }"/>

        <div class="submit">
            <button>Enregistrer</button>
            <button>Annuler</button>
        </div>
    </div>

</template>
