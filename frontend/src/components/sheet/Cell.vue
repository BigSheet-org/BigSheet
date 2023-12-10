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
        methods: {
            sendChange() {
                console.log("[INFO] - Cell with id " + this.id + " has changed value !")
            }
        }
    }
</script>

<template>
  <input type="text"
         v-model="this.model"
         @change="this.sendChange"
  />
</template>
