<template>
    <p v-if="message" class="text-red-600 mt-1">{{ message }}</p>
</template>

<script setup>

const props = defineProps({
    message: String
});
</script>