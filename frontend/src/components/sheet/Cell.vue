<script>
    import UserModel from "../../scripts/Models/UserModel.js";
    import Data from "../../assets/static/Data.js";

    export default {
        data() {
            return {
                model: '',
                colorModel: '',
                lock: false
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
            },
            lockCellModifications: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        emits: {
            valueChange() { return true; },
            selectedCell() { return true; }
        },
        methods: {
            sendChange() {
                if (!this.lock) {
                    this.lock = true;
                    this.$emit('valueChange', this.id, this.model);
                    setTimeout(() => { this.lock = false; },
                        Data.PROGRAM_VALUES.TIMEOUT_BETWEEN_DATA_SENDS
                    );
                }
            },
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
           :disabled="this.lockCellModifications"
           @click="this.selectedCell"
           @keyup="this.sendChange"/>
</template>
