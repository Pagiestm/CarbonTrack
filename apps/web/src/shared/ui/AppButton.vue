<template>
  <component
    :is="tag"
    v-bind="lien"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    :aria-busy="loading || undefined"
    :class="classes"
  >
    <span
      v-if="loading"
      class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'));
const lien = computed(() => (props.to ? { to: props.to } : props.href ? { href: props.href } : {}));

const variantes = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-strong',
  secondary: 'bg-surface-overlay text-ink hover:bg-surface-hover border border-line-strong',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-overlay',
  danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-surface border border-danger/40',
};

const tailles = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  'disabled:cursor-not-allowed disabled:opacity-50',
  variantes[props.variant] ?? variantes.primary,
  tailles[props.size] ?? tailles.md,
  props.block && 'w-full',
]);
</script>
