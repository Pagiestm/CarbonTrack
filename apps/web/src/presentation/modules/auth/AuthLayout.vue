<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <main class="halo flex flex-1 items-center justify-center px-4 py-24 sm:px-6">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <h1 class="font-display text-3xl font-bold text-ink">{{ title }}</h1>
          <p v-if="subtitle" class="mt-2 text-sm text-ink-muted">{{ subtitle }}</p>
        </div>

        <div class="rounded-card border border-line bg-surface-raised p-6 sm:p-8">
          <slot />
        </div>

        <p v-if="$slots.footer" class="mt-6 text-center text-sm text-ink-muted">
          <slot name="footer" />
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/presentation/components/NavBar.vue';

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>
