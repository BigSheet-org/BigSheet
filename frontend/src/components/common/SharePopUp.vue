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
    data() {
        return {
            searchTerm: ''
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
                    <div class="searchbar-container">
                        <input class="searchbar-input" v-model="searchTerm" type="text" placeholder="Ajouter des personnes">
                    </div>
                    <h2>Voici la liste des utilisateurs :</h2>
                    <ul>
                        <li v-for="user in filteredUsers" :key="user.id">{{ user.name }}</li>
                    </ul>
                    <button @click="$emit('dismiss')">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>
