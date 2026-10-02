<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <main id="contenu" class="flex-1 pt-16">
      <div :class="['px-4 py-10 sm:px-6', wide ? '' : 'mx-auto w-full max-w-6xl']">
        <slot />
      </div>
    </main>
    <AppFooter v-if="footer" />
  </div>
</template>

<script setup>
import NavBar from '@/presentation/components/NavBar.vue';
import AppFooter from '@/presentation/components/AppFooter.vue';

defineProps({
  wide: { type: Boolean, default: false },
  footer: { type: Boolean, default: true },
});
</script>
