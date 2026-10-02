<template>
  <p v-if="message" class="text-danger mt-1">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: String,
});
</script>
