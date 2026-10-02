<template>
  <div class="h-72">
    <canvas ref="canevas" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import {
  ACCENT,
  ACCENT_SOFT,
  moisDeLAnnee,
  optionsGraphique,
} from '@/presentation/components/ui/chart-theme.js';

const props = defineProps({
  // Dates ISO : le composant compte lui-même par mois.
  dates: { type: Array, default: () => [] },
  label: { type: String, required: true },
  type: { type: String, default: 'bar' },
});

const canevas = ref(null);
let graphique = null;

const parMois = () => {
  const annee = new Date().getFullYear();
  const compteurs = Array(12).fill(0);
  for (const iso of props.dates) {
    const date = new Date(iso);
    if (date.getFullYear() === annee) compteurs[date.getMonth()] += 1;
  }
  return compteurs;
};

const dessiner = () => {
  graphique?.destroy();
  if (!canevas.value) return;

  graphique = new Chart(canevas.value, {
    type: props.type,
    data: {
      labels: moisDeLAnnee(),
      datasets: [
        {
          label: props.label,
          data: parMois(),
          backgroundColor: ACCENT_SOFT,
          borderColor: ACCENT,
          borderWidth: 2,
          borderRadius: 6,
          tension: 0.35,
          fill: props.type === 'line',
        },
      ],
    },
    options: optionsGraphique({ titreAxeY: props.label }),
  });
};

onMounted(dessiner);
watch(() => props.dates, dessiner);
onBeforeUnmount(() => graphique?.destroy());
</script>
