<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[1fr_1.1fr]">
    <div class="flex min-h-screen flex-col bg-surface lg:min-h-0">
      <header class="px-6 py-6">
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <span class="flex size-8 items-center justify-center rounded-lg bg-accent-soft">
            <Leaf class="size-4 text-accent" aria-hidden="true" />
          </span>
          <span class="text-lg font-bold text-ink">CarbonTrack</span>
        </RouterLink>
      </header>

      <main id="contenu" class="flex flex-1 items-center justify-center px-6 py-10">
        <div class="w-full max-w-sm">
          <h1 class="text-3xl font-bold tracking-tight text-ink">{{ title }}</h1>
          <p v-if="subtitle" class="mt-2 text-sm text-ink-muted">{{ subtitle }}</p>

          <div class="mt-8"><slot /></div>

          <p v-if="$slots.footer" class="mt-8 text-sm text-ink-muted">
            <slot name="footer" />
          </p>
        </div>
      </main>
    </div>

    <aside
      class="relative hidden overflow-hidden border-l border-line bg-surface-raised lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-16"
    >
      <div class="pointer-events-none absolute inset-0" aria-hidden="true" :style="trame" />
      <div class="relative"><slot name="aside" /></div>
    </aside>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Leaf } from 'lucide-vue-next';

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});

const trame = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-line) 1px, transparent 0)',
  backgroundSize: '28px 28px',
};
</script>
