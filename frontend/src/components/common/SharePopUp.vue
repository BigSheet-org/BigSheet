<script>
import PopUpTransition from "../transitions/PopUpTransition.vue";
import User from "../../scripts/DAO/User.js";
import Data from "../../assets/static/Data.js";
import Sheets from "../../scripts/DAO/Sheets.js";
import Input from "../forms/Input.vue";

export default {
    components: { PopUpTransition },
    props: {
        isVisible: {
            type: Boolean,
            required: true
        },
        concernedSheet: {
            required: true,
            type: Number
        }
    },
    data() {
        return {
            searchTerm: '',
            selectedUser: null,
            filteredUsers: null,
            permissionModel: "reader",
            lock: false
        }
    },
    emits: {
        dismiss() { return true; }
    },
    methods: {
        selectUser(id) {
            this.selectedUser = id;
        },
        async shareToUser() {
            if (this.selectedUser !== null && this.permissionModel) {
                await Sheets.shareTo(this.selectedUser, this.concernedSheet, this.permissionModel);
            }
            // We close the popup.
            this.$emit('dismiss');
        },
        async fetchUsers() {
            if (this.searchTerm && this.searchTerm !== "" && !this.lock) {
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
        <div v-if="isVisible" class="pop_up_mask active">
            <div class="wrapper">
                <div class="container">
                    <h1>Partager</h1>
                    <div class="searchbar-container">
                        <input name="Recherche" v-model="searchTerm" type="text" placeholder="Ajouter des personnes"
                            @keyup="this.fetchUsers">
                    </div>
                    <h2>Utilisateurs :</h2>
                    <ul class="popup_user_list">
                        <li v-for="user in filteredUsers" @click="selectUser(user.id)" :key="user.id"
                            :class="{ selected: selectedUser === user.id }">
                            {{ user.login }}
                        </li>
                    </ul>
                    <h2>Permissions :</h2>
                    <select v-model="permissionModel">
                        <option value="reader" selected>Lecture uniquement</option>
                        <option value="writer">Lecture et Ecriture</option>
                    </select>
                    <br />
                    <br />

                    <button @click="this.shareToUser">
                        Terminer
                    </button>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>
