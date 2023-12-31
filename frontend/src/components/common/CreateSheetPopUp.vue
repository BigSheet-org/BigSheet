<script>
import PopUpTransition from "../transitions/PopUpTransition.vue";

export default {
    components: { PopUpTransition },
    data() {
        return {
            sheetTitle: "",
            sheetDetails: ""
        };
    },
    methods: {
        dismiss() {
            this.$emit("dismiss", false);
        },
        confirm() {
            const confirms = {
                title: this.sheetTitle,
                details: this.sheetDetails
            };
            this.$emit("confirm", confirms);
        }
    }
}
</script>

<template>
    <PopUpTransition>
        <div class="pop_up_mask active">
            <div class="wrapper">
                <div class="container">
                    <h1 :class="this.popupClass">{{ "Création d'un nouveau tableau" }}</h1>
                    <div>
                        <label for="title">Titre :</label>
                        <input type="text" id="title" v-model="sheetTitle" />
                    </div>
                    <div>
                        <label for="details">Détails :</label>
                        <input id="details" v-model="sheetDetails"/>
                    </div>
                    <div class="choice">
                        <button @click="confirm()">Valider</button>
                        <button @click="dismiss()">Annuler</button>
                    </div>
                </div>
            </div>
        </div>
    </PopUpTransition>
</template>