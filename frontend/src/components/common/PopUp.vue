<script>
    import PopUpTransition from "../transitions/PopUpTransition.vue";

    export default {
        components: {PopUpTransition},
        data() {
            return {

            }
        },
        props: {
            title: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
            popupClass: {
                type: String,
                required: false,
                default: "success"
            }
        },
        emits: {
            dismiss(){ return true; }
        },
        methods: {
            dismiss() { this.$emit("dismiss"); }
        }
    }
</script>

<template>
    <PopUpTransition>
        <div class="pop_up_mask active">
            <div class="wrapper">
                <div class="container">
                    <h1 :class="this.popupClass">{{this.title}}</h1>
                    <h2>{{this.message}}</h2>
                    <button @click="this.dismiss()">Ok</button>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>