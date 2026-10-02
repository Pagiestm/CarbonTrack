<template>
  <div class="rounded-card border border-dashed border-line-strong px-6 py-14 text-center">
    <component :is="icon" class="mx-auto size-8 text-ink-subtle" aria-hidden="true" />
    <p class="mt-4 font-medium text-ink">{{ title }}</p>
    <p v-if="description" class="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>


<script setup>
import { Inbox } from 'lucide-vue-next';

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: [Object, Function], default: () => Inbox },
});
</script>

