<template>
  <ul class="mt-2 grid gap-1 text-sm">
    <li
      v-for="critere in criteres"
      :key="critere.cle"
      class="flex items-center gap-2"
      :class="criteria[critere.cle] ? 'text-success' : 'text-ink-subtle'"
    >
      <svg class="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          v-if="criteria[critere.cle]"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        />
        <circle v-else cx="10" cy="10" r="3" />
      </svg>
      {{ critere.libelle }}
    </li>
  </ul>
</template>

<script setup>
defineProps({ criteria: { type: Object, required: true } });

const criteres = [
  { cle: 'length', libelle: 'Au moins 8 caractères' },
  { cle: 'uppercase', libelle: 'Une lettre majuscule' },
  { cle: 'lowercase', libelle: 'Une lettre minuscule' },
  { cle: 'number', libelle: 'Un chiffre' },
  { cle: 'symbol', libelle: 'Un symbole' },
];
</script>
