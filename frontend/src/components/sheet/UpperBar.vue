<script>
import Routes from "../../assets/static/Routes.js";
import User from "../../scripts/DAO/User.js";
import UserItem from "./UserItem.vue";
import UserList from "../../scripts/Models/UserList.js";

export default {
    computed: {
        Routes() { return Routes; },
    },
    components:{UserItem},
    props:{
        users: {
            required: true,
            type: UserList
        }
    },
    methods:{

    },
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
            <h4 class="description">Cellule : {{  }}</h4>
            <input>
        </div>
    </div>
</template>