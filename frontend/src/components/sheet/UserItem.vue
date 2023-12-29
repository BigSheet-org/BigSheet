<script>

import {defineComponent} from "vue";
import AppendTransition from "../transitions/AppendTransition.vue";
import UserModel from "../../scripts/Models/UserModel.js";

export default defineComponent({
    components: {AppendTransition},
    props: {
        user: {
            required: true,
            type: UserModel
        }
    },
    data() {
        return {}
    }
})
</script>

<template>
    <AppendTransition>
        <div class="user_item"
             :style="'background-color:' + this.user.color">
            {{ this.user.getInitials() }}
        </div>
    </AppendTransition>
</template>