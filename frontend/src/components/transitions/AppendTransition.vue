<script>
export default {
    // Allows us to tell VueJS when it needs to apply entering transitions or not
    data() {
        return { show: false };
    },
    mounted() { this.show = true; },
}
</script>

<template>
    <Transition name="append" mode="out-in" appear>
        <slot v-if="show"/>   <!-- Passes down components inside the transitions -->
    </Transition>
</template>
