<script>

export default {
    props:{
        text: {
            type: String,
            required: true
        }
    }
}

</script>

<template>
    <div class="tooltip-wrapper">
        <slot />
        <span class="tooltip__text">{{ text }}</span>
    </div>
</template>

