<template>
  <section class="border-b border-line bg-surface-raised px-4 py-16 sm:px-6 sm:py-20">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <div>
          <p class="text-sm font-medium tracking-wide text-accent uppercase">
            Où se cache le carbone
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-ink">
            Ce n'est jamais là où on le croit
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-ink-muted">
            Sur cette extension, la dalle et les fondations pèsent presque la moitié du total. Le
            bois, lui, compte pour moins d'un cinquième.
          </p>
          <p class="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
            <Lightbulb class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Un béton bas carbone à la place du béton courant ferait gagner
              <strong class="text-ink">2,7 t</strong> sur ce seul chantier.
            </span>
          </p>
        </div>

        <ul class="divide-y divide-line border-y border-line">
          <li v-for="poste in postes" :key="poste.nom" class="flex items-center gap-4 py-4">
            <span
              class="size-2.5 shrink-0 rounded-full"
              :style="{ backgroundColor: poste.couleur }"
              aria-hidden="true"
            />
            <div class="min-w-0 flex-1">
              <p class="font-medium text-ink">{{ poste.nom }}</p>
              <p class="text-sm text-ink-subtle">{{ poste.detail }}</p>
            </div>
            <div class="hidden w-40 shrink-0 sm:block">
              <div class="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
                <div
                  class="h-full rounded-full"
                  :style="{ width: `${poste.part}%`, backgroundColor: poste.couleur }"
                />
              </div>
            </div>
            <p class="shrink-0 text-right">
              <span class="block font-semibold tabular-nums text-ink">{{ poste.valeur }}</span>
              <span class="text-xs tabular-nums text-ink-subtle">{{ poste.part }} %</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>


<script setup>
import { Lightbulb } from 'lucide-vue-next';
import { SERIE } from '@/presentation/components/ui/chart-theme.js';

const postes = [
  {
    nom: 'Fondation et dalle',
    detail: '18 m³ de béton C25/30',
    valeur: '5,7 t',
    part: 46,
    couleur: SERIE[0],
  },
  {
    nom: 'Isolation',
    detail: '95 m² de laine de bois',
    valeur: '3,0 t',
    part: 24,
    couleur: SERIE[1],
  },
  {
    nom: 'Ossature bois',
    detail: '6 m³ de sapin douglas',
    valeur: '2,2 t',
    part: 18,
    couleur: SERIE[2],
  },
  {
    nom: 'Menuiseries',
    detail: '6 fenêtres bois double vitrage',
    valeur: '1,5 t',
    part: 12,
    couleur: SERIE[3],
  },
];
</script>

