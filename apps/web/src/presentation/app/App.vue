<template>
  <SkipLink />
  <RouterView />
  <ToastHost />
</template>


<script setup>
import { RouterView } from 'vue-router';
import SkipLink from '@/presentation/components/ui/SkipLink.vue';
import ToastHost from '@/presentation/components/ui/ToastHost.vue';
</script>

