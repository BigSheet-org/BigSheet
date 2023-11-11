<script>

	import Data from "../../assets/static/Data.js";
    import Formatters from "../../scripts/Utility/Formatters.js";
    import FormError from "./FormError.vue";

    export default {
        components: {FormError},
        props:{
            name:{
                required: true,
                type: String,
            },
            inputType:{
                required: false,
                default: "text",
                type: String,
            },
            values:{
                required: false,
                default: [],
                type: Array
            },
            prefill:{
                required: false,
                default: undefined,
            },
            class:{
                required: false,
                default: undefined
            },
            disabled: {
                required: false,
                default: false,
                type: Boolean
            },
            right: {
                required: false,
                default: false,
                type: Boolean
            },
            error: {
                required: false,
                default: false,
                type: Boolean
            },
            error_message: {
                required: false,
                default: "",
                type: String
            }
        },
        emits: {
            changeField(){ return true }
        },
        computed: {
            Data() { return Data },
            id(){ return 'id_'+this.name }
        },
		data(){
			return{
                model: "",
                address_object: undefined,
            }
		},
		methods:{
            sendData(){
                // If the input type is a phone number, we format it before sending.
                if(this.inputType === Data.INPUT_TYPES.phone_number) { this.$emit('changeField', Formatters.unformatPhone(this.model)) }
                // Otherwise, we just emit the model value.
                else { this.$emit('changeField', this.model) }
            },
            formatPhone(){ this.model = Formatters.formatPhone(this.model) },
        },
        beforeMount() {
            // Setting up default values for the fields
            if(this.inputType === Data.INPUT_TYPES.select) { this.model = 0 }

            // If prefill elements are given, we setup the default values.
            if(this.prefill !== undefined) {
                this.model = this.prefill

                if(this.inputType === Data.INPUT_TYPES.phone_number) {
                    this.formatPhone()
                }
            }
        }
    }
</script>

<template>
    <div class="group"
         :class="this.class === undefined ? '' : this.class">

        <input v-if="this.inputType === Data.INPUT_TYPES.mail"
               :disabled="this.disabled"
               :class="{right: this.right, wrong: this.error}"
               :id="id"
               :type="this.inputType"
               v-model="model"
               @change="this.sendData">

        <input v-if="this.inputType === Data.INPUT_TYPES.phone_number"
               :disabled="this.disabled"
               :id="id"
               :class="{right: this.right, wrong: this.error}"
               :type="this.inputType"
               v-model="model"
               @keyup="this.formatPhone"
               @change="this.sendData">

        <select v-if="this.inputType === Data.INPUT_TYPES.select"
                :id="id"
                :disabled="this.disabled"
                :class="{right: this.right, wrong: this.error}"
                v-model="model"
                @change="this.sendData">
            <option :value="0">
                - -                 <!-- Default selected option -->
            </option>
            <option v-for="item in this.values"
                    :value="item.id">
                {{item.text}}
            </option>
        </select>

        <input v-if="this.inputType === Data.INPUT_TYPES.checkbox"
               :id="id"
               :disabled="this.disabled"
               :class="{right: this.right, wrong: this.error}"
               v-model="model"
               type="checkbox"
               @change="this.sendData">
            <div v-if="this.inputType === Data.INPUT_TYPES.checkbox && this.model">Oui</div>
            <div v-if="this.inputType === Data.INPUT_TYPES.checkbox && !this.model">Non</div>

        <textarea v-if="this.inputType === Data.INPUT_TYPES.textarea"
                  :id="id"
                  :class="{right: this.right, wrong: this.error}"
                  :disabled="this.disabled"
                  v-model="model"
                  @change="this.sendData"/>

        <input v-if="this.inputType === Data.INPUT_TYPES.password"
               :id="id"
               :class="{right: this.right, wrong: this.error}"
               :disabled="this.disabled"
               v-model="model"
               :type="this.inputType"
               @change="this.sendData">

        <input v-if="this.inputType === Data.INPUT_TYPES.text"
               :id="id"
               :class="{right: this.right, wrong: this.error}"
               :disabled="this.disabled"
               v-model="model"
               :type="this.inputType"
               @change="this.sendData">

        <label :class="{right : this.right,
                wrong : this.error,
                filled: this.model !== ''}"
               :for="id">
            {{this.name}}
        </label>

        <form-error v-if="error"
                    :message="this.error_message"/>
    </div>
</template>