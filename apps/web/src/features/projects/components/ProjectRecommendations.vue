<template>
  <AppCard title="Réduire l'empreinte de vos projets" subtitle="Quelques leviers qui pèsent lourd.">
    <ul class="grid gap-3 sm:grid-cols-2">
      <li v-for="conseil in conseils" :key="conseil" class="flex gap-2.5 text-sm text-ink-muted">
        <svg
          class="mt-0.5 size-4 shrink-0 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
          />
        </svg>
        {{ conseil }}
      </li>
    </ul>
  </AppCard>
</template>

<script setup>
import AppCard from '@/shared/ui/AppCard.vue';

// Les anciens conseils parlaient de calendrier et de communication d'équipe :
// rien à voir avec l'empreinte carbone, et l'un d'eux contenait une faute.
const conseils = [
  'Privilégiez les matériaux biosourcés : bois, chanvre, paille.',
  "Comparez plusieurs fournisseurs : l'écart d'empreinte peut dépasser 50 %.",
  'Réduisez les distances : un matériau local évite le transport.',
  "Réemployez ce qui peut l'être plutôt que de produire du neuf.",
  'Ajustez les quantités au plus juste pour limiter les chutes.',
  'Comparez vos projets entre eux pour repérer les postes les plus lourds.',
];
</script>
