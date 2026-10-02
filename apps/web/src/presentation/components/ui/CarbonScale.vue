<template>
  <div>
    <div class="relative h-2 overflow-hidden rounded-full" :style="degrade" />

    <div class="relative mt-2" :style="{ height: `${hauteur}px` }">
      <div
        v-for="(materiau, index) in materiaux"
        :key="materiau.nom"
        class="absolute flex -translate-x-1/2 flex-col items-center"
        :style="{ left: `${position(materiau.kg)}%`, top: `${index % 2 ? 42 : 0}px` }"
      >
        <span
          class="w-px"
          :style="{ height: `${index % 2 ? 4 : 8}px`, backgroundColor: couleur(materiau.kg) }"
          aria-hidden="true"
        />
        <span class="mt-1 text-sm font-semibold tabular-nums text-ink">{{ materiau.kg }}</span>
        <span class="mt-0.5 max-w-28 text-center text-[0.6875rem] leading-tight text-ink-subtle">
          {{ materiau.nom }}
        </span>
      </div>
    </div>

    <div class="mt-1 flex justify-between border-t border-line pt-3 text-xs text-ink-subtle">
      <span class="tabular-nums">{{ min }} kg</span>
      <span class="text-ink-muted">{{ unite }}</span>
      <span class="tabular-nums">{{ max }} kg</span>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
  materiaux: { type: Array, required: true },
  unite: { type: String, default: 'kg eq. CO₂ par m²' },
});

const valeurs = computed(() => props.materiaux.map((m) => m.kg));
const min = computed(() => Math.min(...valeurs.value));
const max = computed(() => Math.max(...valeurs.value));
const hauteur = computed(() => (props.materiaux.length > 4 ? 92 : 50));

const position = (kg) => {
  const etendue = max.value - min.value || 1;
  return 7 + ((kg - min.value) / etendue) * 86;
};

const couleur = (kg) => {
  const part = (kg - min.value) / (max.value - min.value || 1);
  if (part < 0.34) return 'var(--color-level-low)';
  if (part < 0.67) return 'var(--color-level-mid)';
  return 'var(--color-level-high)';
};

const degrade = {
  backgroundImage:
    'linear-gradient(to right, var(--color-level-low), var(--color-level-mid), var(--color-level-high))',
};
</script>

