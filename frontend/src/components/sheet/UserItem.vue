<script>

import {defineComponent} from "vue";
import AppendTransition from "../transitions/AppendTransition.vue";
import UserModel from "../../scripts/Models/UserModel.js";
import Tooltip from "../common/Tooltip.vue";

export default defineComponent({
    components: {Tooltip, AppendTransition},
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
        <Tooltip :text="this.user.login">
            <div class="user_item"
                 :style="'background-color:' + this.user.color">
                {{ this.user.getInitials() }}
            </div>
        </Tooltip>
    </AppendTransition>
</template>