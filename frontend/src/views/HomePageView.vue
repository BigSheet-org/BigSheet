<script>
    import NavBar from "../components/navbar/NavBar.vue";
    import SlideAndFadeTransition from "../components/transitions/SlideAndFadeTransition.vue";
    import HomePageContent from "../components/HomePageContent.vue";

    export default {
        components: {HomePageContent, SlideAndFadeTransition, NavBar},
        methods: {
            redirect() {

            }
        }
    }
</script>

<template>
    <NavBar/>
    <SlideAndFadeTransition>
        <HomePageContent/>
    </SlideAndFadeTransition>
</template>