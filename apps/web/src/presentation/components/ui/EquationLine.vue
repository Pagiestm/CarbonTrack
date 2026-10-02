<template>
  <div
    class="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-field border border-line bg-surface-raised px-4 py-2.5 font-mono text-sm"
  >
    <span class="text-ink">{{ quantite }}</span>
    <span class="text-ink-subtle">×</span>
    <span class="text-ink">{{ facteur }}</span>
    <span class="text-ink-subtle">=</span>
    <span class="font-semibold text-accent">{{ resultat }}</span>
  </div>
</template>

<script setup>
defineProps({
  quantite: { type: String, required: true },
  facteur: { type: String, required: true },
  resultat: { type: String, required: true },
});
</script>
