<script>
import PopUpTransition from "../transitions/PopUpTransition.vue";

export default {
    components: { PopUpTransition },
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    emits: {
        dismiss() { return true; }
    },
    methods: {
    }
}
</script>

<template>
    <PopUpTransition>
        <div v-if="isVisible" class="pop_up_mask active">
            <div class="wrapper">
                <div class="container">
                    <h1>Partager</h1>
                    <h2>Voici la liste des utilisateurs :</h2>
                    <button @click="$emit('dismiss')">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>
