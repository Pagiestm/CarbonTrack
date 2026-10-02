<template>
  <div
    class="fixed inset-0 z-100 flex items-center justify-center bg-ink/30 p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @click.self="$emit('cancel')"
    @keydown.esc="$emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-card border border-line bg-surface-raised p-6">
      <div class="flex size-10 items-center justify-center rounded-full bg-danger-soft">
        <TriangleAlert class="size-5 text-danger" aria-hidden="true" />
      </div>
      <h2 class="mt-4 text-lg font-bold text-ink">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-sm text-ink-muted">{{ description }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <AppButton ref="boutonAnnuler" variant="secondary" size="sm" @click="$emit('cancel')">
          Annuler
        </AppButton>
        <AppButton variant="danger" size="sm" :loading="loading" @click="$emit('confirm')">
          {{ confirmLabel }}
        </AppButton>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { TriangleAlert } from 'lucide-vue-next';
import AppButton from '@/presentation/components/ui/AppButton.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Supprimer' },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['cancel', 'confirm']);

const auClavier = (e) => e.key === 'Escape' && emit('cancel');

onMounted(() => {
  document.addEventListener('keydown', auClavier);
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', auClavier);
  document.body.style.overflow = '';
});
</script>

