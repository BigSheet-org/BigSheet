<script>
import PopUpTransition from "../transitions/PopUpTransition.vue";
import User from "../../scripts/DAO/User.js";
import Data from "../../assets/static/Data.js";

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
            searchTerm: '',
            selectedUser: null,
            filteredUsers: null,
            lock: false
        }
    },
    emits: {
        dismiss() { return true; }
    },
    methods: {
        selectUser(id) {
            this.selectedUser = id;
            console.log("[INFO] - Selected user with id : " + this.selectedUser);
        },
        shareToUser() {
            if (this.selectedUser !== null) {
                console.log("[INFO] - Sharing to user with id : " + this.selectedUser);
            }
            // We close the popup.
            this.$emit('dismiss');
        },
        async fetchUsers() {
            if (this.searchTerm && !this.lock) {
                this.lock = true;
                setTimeout(async () => {
                        this.lock = false;
                        this.filteredUsers = await User.fetchUsersByLogin(this.searchTerm);
                    },
                    Data.PROGRAM_VALUES.TIMEOUT_BETWEEN_DATA_SENDS
                );
            }
        }
    }
}
</script>

<template>
    <PopUpTransition>
        <div v-if="isVisible"
             class="pop_up_mask active">
            <div class="wrapper">
                <div class="container">
                    <h1>Partager</h1>
                    <div class="searchbar-container">
                        <input class="searchbar-input"
                               v-model="searchTerm"
                               type="text"
                               placeholder="Ajouter des personnes"
                               @keyup="this.fetchUsers">
                    </div>
                    <h2>Utilisateurs :</h2>
                    <ul class="popup_user_list">
                        <li v-for="user in this.filteredUsers"
                            @click="this.selectUser(user.id)"
                            :key="user.id">
                            {{ user.login }}
                        </li>
                    </ul>
                    <button @click="this.shareToUser">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>
