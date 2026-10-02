<template>
  <section class="border-b border-line bg-surface-raised px-4 py-16 sm:px-6 sm:py-20">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <div>
          <p class="text-sm font-medium tracking-wide text-accent uppercase">Se représenter</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-ink">
            12,4 tonnes, ça veut dire quoi&nbsp;?
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-ink-muted">
            Une tonne de CO₂ ne parle à personne. CarbonTrack convertit chaque résultat en repères
            du quotidien.
          </p>
        </div>

        <dl
          class="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2"
        >
          <div v-for="repere in reperes" :key="repere.libelle" class="bg-surface-raised p-6">
            <component :is="repere.icone" class="size-5 text-accent" aria-hidden="true" />
            <dt class="mt-3 text-2xl font-bold tabular-nums text-ink">{{ repere.valeur }}</dt>
            <dd class="mt-1 text-sm leading-relaxed text-ink-muted">{{ repere.libelle }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Car, Flame, Plane, TreePine } from 'lucide-vue-next';

const reperes = [
  {
    icone: Car,
    valeur: '64 250 km',
    libelle: 'en voiture thermique, soit une fois et demie le tour de la Terre',
  },
  { icone: Plane, valeur: '13 allers-retours', libelle: 'Paris – New York en avion, par passager' },
  { icone: Flame, valeur: '5 logements', libelle: 'chauffés au gaz pendant une année entière' },
  {
    icone: TreePine,
    valeur: '560 arbres',
    libelle: 'à laisser pousser un an pour absorber autant',
  },
];
</script>
