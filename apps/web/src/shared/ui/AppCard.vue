<template>
  <div class="rounded-card border border-line bg-surface-raised p-6">
    <h2 v-if="title" class="text-lg font-semibold text-ink">{{ title }}</h2>
    <p v-if="subtitle" class="mt-1 text-sm text-ink-muted">{{ subtitle }}</p>
    <div :class="title || subtitle ? 'mt-5' : ''"><slot /></div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
});
</script>
