<template>
    <form @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
        <div v-for="field in fields" :key="field.name" class="mb-6">
            <label :for="field.name" class="block text-white mb-2">{{ field.label }}</label>
            <input v-if="field.type !== 'textarea'" :type="field.type" :name="field.name" v-model="formData[field.name]"
                :required="field.required"
                class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen" />
            <textarea v-else :name="field.name" v-model="formData[field.name]" :required="field.required"
                class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"></textarea>
            <FormError :message="errors[field.name]" />
        </div>
        <button type="submit"
            class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
            Envoyer
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import FormError from '../components/Alert/FormError.vue';

const props = defineProps({
    fields: {
        type: Array,
        required: true,
    },
    onSubmit: {
        type: Function,
        required: true,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
});

const formData = ref(
    props.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
);

const handleSubmit = () => {
    props.onSubmit(formData.value);
};
</script>