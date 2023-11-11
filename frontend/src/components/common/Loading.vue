<script>
    import SmoothFade from "../transitions/SmoothFade.vue";

    export default {
        components: {SmoothFade}
    }
</script>

<template>
    <smooth-fade>
        <div class="loading">
            <img src="../../assets/pictures/Logo_spinner.svg" alt="Loading ...">
        </div>
    </smooth-fade>
</template>
