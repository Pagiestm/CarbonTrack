<template>
  <component
    :is="tag"
    v-bind="attributsLien"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    :aria-busy="loading || undefined"
    :class="classes"
  >
    <Loader2 v-if="loading" class="size-4 shrink-0 animate-spin" aria-hidden="true" />
    <component :is="icon" v-else-if="icon" class="size-4 shrink-0" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  icon: { type: [Object, Function], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'));
const attributsLien = computed(() =>
  props.to ? { to: props.to } : props.href ? { href: props.href } : {},
);

const variantes = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-strong shadow-[0_0_0_1px] shadow-accent/20',
  secondary: 'border border-line-strong bg-surface-overlay text-ink hover:bg-surface-hover',
  ghost: 'text-ink-muted hover:bg-surface-overlay hover:text-ink',
  danger: 'border border-danger/40 bg-danger-soft text-danger hover:bg-danger hover:text-surface',
};

const tailles = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-field font-medium transition-all',
  'disabled:cursor-not-allowed disabled:opacity-50',
  variantes[props.variant] ?? variantes.primary,
  tailles[props.size] ?? tailles.md,
  props.block && 'w-full',
]);
</script>
