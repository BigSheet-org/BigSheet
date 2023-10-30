<script>
    import Input from "./Input.vue";

    export default {
        components: {Input},
        methods: {
            changeLogin() {

            },
            changePassword() {

            },
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
        <Input type="text"
               name="Identifiant"
               :prefill="this.login"
               @changeField="this.changeLogin()"/>
        <Input type="password"
               name="Mot de passe"
               :prefill="this.password"
               @changeField="this.changePassword()"/>
    </div>
</template>
