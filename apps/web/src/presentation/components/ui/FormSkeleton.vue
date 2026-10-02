<template>
  <div class="space-y-5" aria-hidden="true">
    <div v-for="n in fields" :key="n">
      <div class="mb-1.5 h-4 w-28 animate-pulse rounded-field bg-surface-overlay" />
      <div
        class="animate-pulse rounded-field bg-surface-overlay"
        :class="n === multiline ? 'h-24' : 'h-10.5'"
      />
    </div>

    <div v-if="actions" class="flex justify-end gap-3">
      <div class="h-10 w-24 animate-pulse rounded-field bg-surface-overlay" />
      <div class="h-10 w-36 animate-pulse rounded-field bg-surface-overlay" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  fields: { type: Number, default: 3 },
  multiline: { type: Number, default: 0 },
  actions: { type: Boolean, default: true },
});
</script>
