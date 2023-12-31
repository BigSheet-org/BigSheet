<script>
    import UserModel from "../../scripts/Models/UserModel.js";

    export default {
        data() {
            return {
                model: '',
                colorModel: ''
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
            },
            borderColor: {
                required: false,
                type: String,
                default: '',
            },
            modifyingUser: {
                required: false,
                type: UserModel,
                default: null
            }
        },
        emits: {
            valueChange() { return true; },
            selectedCell() { return true; }
        },
        methods: {
            sendChange() { this.$emit('valueChange', this.id, this.model); },
            selectedCell() { this.$emit('selectedCell', this.id); }
        },
        watch: {    // We watch for props value changes.
            prefill: {
                immediate: true, // The callback will be called immediately after the start of the observation
                handler(val, oldVal) { this.model = val; }
            },
            borderColor: {
                immediate: true,
                handler(val, oldVal) { this.colorModel = val; }
            }
        },
        computed: {
            Style() { return this.colorModel === '' ? "border: none" : `border: 2px solid ${this.colorModel}` },
        },
        mounted() {
            this.colorModel = this.borderColor;
            this.model = this.prefill;
        }
    }
</script>

<template>
    <input type="text"
         v-model="this.model"
         :style="Style"
         @click="this.selectedCell"
         @change="this.sendChange"/>

</template>
