<template>
  <section :class="['rounded-card border border-line bg-surface-raised', padding]">
    <header v-if="title || $slots.actions" class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-ink">{{ title }}</h2>
        <p v-if="subtitle" class="mt-1 text-sm text-ink-muted">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  padding: { type: String, default: 'p-6' },
});
</script>
