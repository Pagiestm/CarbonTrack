<template>
    <div class="relative max-w-md mx-auto lg:mx-0">
        <input type="text" v-model="searchQuery" @input="emitSearch"
            class="w-full py-3 pl-12 pr-4 text-gray-800 bg-white border border-customGreen rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customGreen transition-all duration-200 ease-in-out placeholder-gray-400"
            placeholder="Rechercher..." />
        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20"
            height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);

const searchQuery = ref('');

const emitSearch = () => {
    emit('search', searchQuery.value);
};
</script>