<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      tons[tone] ?? tons.neutral,
    ]"
  >
    <component :is="icon" v-if="icon" class="size-3.5" aria-hidden="true" />
    <slot />
  </span>
</template>


<script setup>
defineProps({
  tone: { type: String, default: 'neutral' },
  icon: { type: [Object, Function], default: null },
});

const tons = {
  neutral: 'border-line-strong bg-surface-overlay text-ink-muted',
  accent: 'border-accent/30 bg-accent-soft text-accent',
  success: 'border-success/30 bg-success-soft text-success',
  danger: 'border-danger/30 bg-danger-soft text-danger',
};
</script>

