<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-0 z-200 flex flex-col items-center gap-2 p-4 sm:items-end"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-field border px-3.5 py-3 text-sm shadow-lg',
          tons[toast.ton].classes,
        ]"
      >
        <component :is="tons[toast.ton].icone" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span class="flex-1">{{ toast.message }}</span>
        <button
          type="button"
          class="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Fermer"
          @click="retirer(toast.id)"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-vue-next';
import { useToasts } from '@/presentation/composables/useToasts.js';

const { toasts, retirer } = useToasts();

const tons = {
  success: { classes: 'border-success/30 bg-success-soft text-success', icone: CheckCircle2 },
  danger: { classes: 'border-danger/30 bg-danger-soft text-danger', icone: TriangleAlert },
  info: { classes: 'border-line-strong bg-surface-raised text-ink', icone: Info },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
