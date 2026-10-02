<template>
  <p
    :role="tone === 'danger' ? 'alert' : 'status'"
    :class="['flex gap-2.5 rounded-field border px-3 py-2.5 text-sm', styles]"
  >
    <component :is="icone" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <span><slot /></span>
  </p>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircle2, Info, TriangleAlert } from 'lucide-vue-next';

const props = defineProps({ tone: { type: String, default: 'danger' } });

const tons = {
  danger: { classes: 'border-danger/40 bg-danger-soft text-danger', icone: TriangleAlert },
  success: { classes: 'border-success/40 bg-success-soft text-success', icone: CheckCircle2 },
  info: { classes: 'border-line-strong bg-surface-overlay text-ink-muted', icone: Info },
};

const styles = computed(() => (tons[props.tone] ?? tons.danger).classes);
const icone = computed(() => (tons[props.tone] ?? tons.danger).icone);
</script>
