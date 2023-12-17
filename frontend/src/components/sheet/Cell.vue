<script>
    export default {
        data() {
            return {
                model: ''
            }
        },
        props: {
            id: {
                required: true,
                type: String
            },
            prefill: {
                required: false,
                type: String,
                default: '',
            }
        },
        emits: {
            valueChange() { return true; }
        },
        methods: {
            sendChange() { this.$emit('valueChange', this.id, this.model); }
        },
        mounted() {}
    }
</script>

<template>
  <input type="text"
         v-model="this.model"
         @change="this.sendChange"/>
</template>
