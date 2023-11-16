<script>
    import SlideAndFadeTransition from "../components/transitions/SlideAndFadeTransition.vue";
    import NavBar from "../components/navbar/NavBar.vue";
    import InscriptionForm from "../components/forms/InscriptionForm.vue";
    import CompteForm from "../components/forms/CompteForm.vue";

    export default {
        components: {CompteForm, InscriptionForm, NavBar, SlideAndFadeTransition}
    }
</script>

<template>
    <NavBar/>

    <SlideAndFadeTransition>
        <CompteForm/>
    </SlideAndFadeTransition>
</template>
