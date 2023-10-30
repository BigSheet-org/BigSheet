<script>

import SmoothFade from "../transitions/SmoothFade.vue";

export default {
    components: {SmoothFade},
    props:{
        message: {
            required: true,
            type: String
        },
        class:{
            required: false,
            type: String,
            default: ""
        }
    }
}
</script>

<template>
    <SmoothFade>
        <div class="error" :class="this.class"> {{message}} </div>
    </SmoothFade>
</template>