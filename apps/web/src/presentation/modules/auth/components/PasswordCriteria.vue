<template>
  <ul class="mt-2.5 grid gap-1.5 sm:grid-cols-2">
    <li
      v-for="critere in criteres"
      :key="critere.cle"
      class="flex items-center gap-1.5 text-xs"
      :class="criteria[critere.cle] ? 'text-success' : 'text-ink-subtle'"
    >
      <component
        :is="criteria[critere.cle] ? Check : Circle"
        class="size-3.5 shrink-0"
        aria-hidden="true"
      />
      {{ critere.libelle }}
    </li>
  </ul>
</template>


<script setup>
import { Check, Circle } from 'lucide-vue-next';

defineProps({ criteria: { type: Object, required: true } });

const criteres = [
  { cle: 'length', libelle: '8 caractères minimum' },
  { cle: 'uppercase', libelle: 'Une majuscule' },
  { cle: 'lowercase', libelle: 'Une minuscule' },
  { cle: 'number', libelle: 'Un chiffre' },
  { cle: 'symbol', libelle: 'Un symbole' },
];
</script>

