<template>
    <p v-if="message" class="text-red-600 mt-1">{{ message }}</p>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    message: String
});
</script>