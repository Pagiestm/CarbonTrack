<template>
  <div class="grid gap-6 lg:grid-cols-[18rem_1fr]">
    <div class="relative h-64">
      <canvas ref="canevas" />
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-ink">{{ total.format() }}</span>
        <span class="text-xs text-ink-subtle">eq. CO₂</span>
      </div>
    </div>

    <ul class="space-y-3">
      <li v-for="({ ligne, part }, index) in repartition" :key="ligne.materialId">
        <div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          <span class="flex items-center gap-2 text-ink">
            <span
              class="size-2.5 shrink-0 rounded-full"
              :style="{ backgroundColor: couleur(index) }"
              aria-hidden="true"
            />
            {{ ligne.material?.name ?? 'Matériau supprimé' }}
            <span class="text-ink-subtle"> × {{ ligne.quantity }} {{ ligne.material?.unit }} </span>
          </span>
          <span class="shrink-0 text-ink-muted">
            {{ ligne.footprint.format() }} · {{ Math.round(part) }}&nbsp;%
          </span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
          <div
            class="h-full rounded-full"
            :style="{ width: `${part}%`, backgroundColor: couleur(index) }"
          />
        </div>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { Project } from '@/domain/entities/Project.js';
import { SERIE, optionsAnneau } from '@/presentation/components/ui/chart-theme.js';

const props = defineProps({ project: { type: Project, required: true } });

const canevas = ref(null);
let graphique = null;

const repartition = computed(() => props.project.repartition);
const total = computed(() => props.project.totalFootprint);
const couleur = (index) => SERIE[index % SERIE.length];

const dessiner = () => {
  graphique?.destroy();
  if (!canevas.value || !repartition.value.length) return;

  graphique = new Chart(canevas.value, {
    type: 'doughnut',
    data: {
      labels: repartition.value.map(({ ligne }) => ligne.material?.name ?? 'Inconnu'),
      datasets: [
        {
          data: repartition.value.map(({ ligne }) => ligne.footprint.kg),
          backgroundColor: repartition.value.map((_, i) => couleur(i)),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...optionsAnneau(),
      plugins: { ...optionsAnneau().plugins, legend: { display: false } },
    },
  });
};

onMounted(dessiner);
watch(repartition, dessiner);
onBeforeUnmount(() => graphique?.destroy());
</script>

