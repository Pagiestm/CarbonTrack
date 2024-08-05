<template>
    <div class="flex items-center justify-center mt-6">
        <button @click="prevPage" :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 text-white bg-customGreen rounded-full shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fas fa-chevron-left"></i>
        </button>
        <span class="mx-2 text-customGreen">Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 text-white bg-customGreen rounded-full shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['pageChange']);

const currentPage = ref(1);
const totalPages = ref(1);

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        emit('pageChange', currentPage.value);
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        emit('pageChange', currentPage.value);
    }
};

const props = defineProps({
    totalItems: {
        type: Number,
        required: true
    },
    itemsPerPage: {
        type: Number,
        default: 10
    }
});

watch(
    () => props.totalItems,
    (newTotalItems) => {
        totalPages.value = Math.ceil(newTotalItems / props.itemsPerPage);
    }
);
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>