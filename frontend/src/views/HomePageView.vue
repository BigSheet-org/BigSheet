<script>
    import NavBar from "../components/navbar/NavBar.vue";

    export default {
        components: {NavBar},
        methods: {
            redirect() {

            }
        }
    }
</script>

<template>
    <NavBar/>
    <button>
        <router-link to="/connexion">Connexion</router-link>
    </button>
</template>