<script>
import Routes from "../../assets/static/Routes.js";
import User from "../../scripts/DAO/User.js";
import UserItem from "./UserItem.vue";
import UserList from "../../scripts/Models/UserList.js";
import UserModel from "../../scripts/Models/UserModel.js";
import Data from "../../assets/static/Data.js";

export default {
    data() {
        return {
            model: "",
            lock: false
        }
    },
    computed: {
        Routes() { return Routes; },
    },
    components:{UserItem},
    props:{
        users: {
            required: true,
            type: UserList
        },
        currentCell: {
            required: true
        }
    },
    methods:{
        sendFormula() {
            if (!this.lock) {
                this.lock = true;
                setTimeout(() => {
                        this.lock = false;
                        this.$emit('valueChange', this.id, this.model);
                    },
                    Data.PROGRAM_VALUES.TIMEOUT_BETWEEN_DATA_SENDS
                );
            }
        },
    },
    watch: {    // We watch for props value changes.
        currentCell: {
            immediate: true, // The callback will be called immediately after the start of the observation
            handler(val, oldVal) { this.model = val.content; }
        }
    },
    beforeMount() {
        this.model = this.currentCell.content;
    }
}
</script>

<template>
    <div class="upper_bar">
        <div class="title">
            <router-link :to="Routes.HOME.path">
                <img src="../../assets/pictures/Logo_webpage.png" alt="BigSheet logo">
            </router-link>
            <h1>BigSheet</h1>
        </div>

        <div class="user_items">
            <UserItem v-for="user in this.users.userList"
                      :user="user"/>
        </div>

        <div class="formulas_input">
            <h4 class="description">Cellule : {{ this.currentCell.id }}</h4>
            <input v-model="this.model"
                   @keyup="this.sendFormula">
        </div>
    </div>
</template>