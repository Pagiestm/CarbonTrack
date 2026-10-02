<template>
  <nav
    v-if="page.pageCount > 1"
    class="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4"
    aria-label="Pagination"
  >
    <p class="text-sm text-ink-muted">
      <span class="tabular-nums">{{ page.from }}–{{ page.to }}</span> sur
      <span class="tabular-nums">{{ page.total }}</span>
    </p>

    <div class="flex items-center gap-1">
      <AppButton
        variant="ghost"
        size="sm"
        :icon="ChevronLeft"
        :disabled="page.page === 1 || loading"
        aria-label="Page précédente"
        @click="$emit('update:modelValue', page.page - 1)"
      />
      <button
        v-for="numero in numeros"
        :key="numero"
        type="button"
        :disabled="numero === '…' || loading"
        :aria-current="numero === page.page ? 'page' : undefined"
        :class="[
          'h-9 min-w-9 rounded-field px-2 text-sm font-medium transition-colors',
          numero === page.page
            ? 'bg-accent text-accent-ink'
            : numero === '…'
              ? 'cursor-default text-ink-subtle'
              : 'text-ink-muted hover:bg-surface-overlay hover:text-ink',
        ]"
        @click="numero !== '…' && $emit('update:modelValue', numero)"
      >
        {{ numero }}
      </button>
      <AppButton
        variant="ghost"
        size="sm"
        :icon="ChevronRight"
        :disabled="page.page === page.pageCount || loading"
        aria-label="Page suivante"
        @click="$emit('update:modelValue', page.page + 1)"
      />
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { Page } from '@/domain/entities/Page.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const props = defineProps({
  page: { type: Page, required: true },
  loading: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);

const numeros = computed(() => {
  const { page, pageCount } = props.page;
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const fenetre = new Set([1, pageCount, page, page - 1, page + 1]);
  const gardes = [...fenetre].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);

  const avecEllipses = [];
  gardes.forEach((numero, i) => {
    if (i && numero - gardes[i - 1] > 1) avecEllipses.push('…');
    avecEllipses.push(numero);
  });
  return avecEllipses;
});
</script>
