<template>
  <div class="rounded-card border border-line bg-surface-raised p-5">
    <div class="flex items-start justify-between gap-3">
      <p class="text-xs text-ink-subtle">{{ label }}</p>
      <component
        :is="icon"
        v-if="icon"
        class="size-4 shrink-0 text-ink-subtle"
        aria-hidden="true"
      />
    </div>
    <p class="mt-2 text-2xl font-bold tabular-nums text-ink">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-ink-subtle">{{ hint }}</p>
    <div v-if="$slots.default" class="mt-3"><slot /></div>
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
