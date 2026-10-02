<template>
  <div class="max-w-md">
    <p class="text-xs font-medium tracking-wide text-accent uppercase">Ce que vous obtenez</p>

    <h2 class="mt-4 text-2xl font-bold tracking-tight text-balance text-ink">
      Le chiffre que personne ne vous donne au devis
    </h2>

    <div class="mt-7 rounded-card border border-line bg-surface p-5">
      <p class="text-xs text-ink-subtle">Extension ossature bois · 40 m²</p>
      <div class="mt-3 flex items-baseline gap-3">
        <span class="text-3xl font-bold tabular-nums text-ink">12,4 t</span>
        <span class="text-sm text-ink-muted">eq. CO₂</span>
      </div>
      <div class="mt-4 space-y-2.5">
        <div v-for="poste in postes" :key="poste.nom">
          <div class="mb-1 flex justify-between text-xs">
            <span class="text-ink-muted">{{ poste.nom }}</span>
            <span class="tabular-nums text-ink-subtle">{{ poste.part }} %</span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
            <div
              class="h-full rounded-full"
              :style="{ width: `${poste.part}%`, backgroundColor: poste.couleur }"
            />
          </div>
        </div>
      </div>
    </div>

    <ul class="mt-7 space-y-4">
      <li v-for="avantage in avantages" :key="avantage" class="flex items-start gap-3 text-sm">
        <Check class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
        <span class="leading-relaxed text-ink-muted">{{ avantage }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';
import { SERIE } from '@/presentation/components/ui/chart-theme.js';

const postes = [
  { nom: 'Fondation et dalle', part: 46, couleur: SERIE[0] },
  { nom: 'Isolation', part: 24, couleur: SERIE[1] },
  { nom: 'Ossature bois', part: 18, couleur: SERIE[2] },
  { nom: 'Menuiseries', part: 12, couleur: SERIE[3] },
];

const avantages = [
  '56 matériaux de construction avec leur empreinte, leur unité et leur prix',
  "L'empreinte ramenée au mètre carré, pour comparer deux chantiers de tailles différentes",
  'Des variantes dupliquées en un clic pour arbitrer entre deux matériaux',
  'Un export CSV à joindre à un dossier ou à une demande de subvention',
];
</script>
