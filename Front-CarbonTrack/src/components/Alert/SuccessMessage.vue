<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 class="text-2xl font-bold text-green-600 mb-4">Succès!</h2>
            <p class="mb-4">{{ message }}</p>
            <button @click="close"
                class="bg-customGreen text-white font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                OK
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    message: {
        type: String,
        required: true
    }
});

const emits = defineEmits(['close']);

const close = () => {
    emits('close');
};
</script>