<script>
    import NavBar from "../components/navbar/NavBar.vue";
    import ConnexionForm from "../components/forms/ConnexionForm.vue";
    import SlideAndFadeTransition from "../components/transitions/SlideAndFadeTransition.vue";

    export default {
        components: {SlideAndFadeTransition, ConnexionForm, NavBar}
    }
</script>

<template>
    <NavBar/>

    <SlideAndFadeTransition>
        <ConnexionForm/>
    </SlideAndFadeTransition>
</template>
