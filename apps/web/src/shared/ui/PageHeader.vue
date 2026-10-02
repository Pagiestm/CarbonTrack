<template>
  <header class="mb-8">
    <p v-if="eyebrow" class="mb-2 text-sm font-medium text-accent">{{ eyebrow }}</p>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 max-w-2xl text-ink-muted">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex gap-3"><slot name="actions" /></div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
});
</script>
