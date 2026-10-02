<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
      styles,
    ]"
  >
    <span class="size-1.5 rounded-full bg-current" aria-hidden="true" />
    {{ footprint.format() }}
    <span class="sr-only">équivalent CO2, niveau {{ libelle }}</span>
  </span>
</template>


<script setup>
import { computed } from 'vue';
import { Footprint } from '@/domain/entities/Footprint.js';

const props = defineProps({ footprint: { type: Footprint, required: true } });

const niveaux = {
  faible: { classes: 'border-level-low/30 bg-level-low-soft text-level-low', libelle: 'sobre' },
  modere: { classes: 'border-level-mid/30 bg-level-mid-soft text-level-mid', libelle: 'modéré' },
  eleve: { classes: 'border-level-high/30 bg-level-high-soft text-level-high', libelle: 'élevé' },
};

const styles = computed(() => niveaux[props.footprint.niveau].classes);
const libelle = computed(() => niveaux[props.footprint.niveau].libelle);
</script>

