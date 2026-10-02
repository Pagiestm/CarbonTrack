<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <main :class="['flex-1 px-4 pt-24 pb-16 sm:px-6', wide ? '' : 'mx-auto w-full max-w-6xl']">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import NavBar from '@/shared/components/NavBar.vue';
import AppFooter from '@/shared/components/AppFooter.vue';

defineProps({ wide: { type: Boolean, default: false } });
</script>
