<script>
import NavBar from "../components/navbar/NavBar.vue";
import SlideAndFadeTransition from "../components/transitions/SlideAndFadeTransition.vue";
import InscriptionForm from "../components/forms/InscriptionForm.vue";

export default {
    components: {InscriptionForm, SlideAndFadeTransition, NavBar}
}
</script>

<template>
    <NavBar/>

    <SlideAndFadeTransition>
        <InscriptionForm/>
    </SlideAndFadeTransition>
</template>
