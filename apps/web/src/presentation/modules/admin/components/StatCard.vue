<template>
  <div class="rounded-card border border-line bg-surface-raised p-5">
    <div class="flex items-center justify-between">
      <p class="text-xs text-ink-subtle">{{ label }}</p>
      <component :is="icon" class="size-4 text-ink-subtle" aria-hidden="true" />
    </div>
    <p class="mt-2 font-display text-3xl font-bold text-ink">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-ink-subtle">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
});
</script>
