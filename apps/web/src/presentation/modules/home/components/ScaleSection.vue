<template>
  <section class="border-b border-line px-4 py-16 sm:px-6 sm:py-20">
    <div class="mx-auto w-full max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-sm font-medium tracking-wide text-accent uppercase">L'échelle réelle</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl">
          À performance égale, un rapport de 1 à 7
        </h2>
        <p class="mt-4 leading-relaxed text-ink-muted">
          Ces isolants assurent la même résistance thermique. Leur empreinte, elle, n'a rien de
          comparable.
        </p>
      </div>

      <div class="mt-12 rounded-card border border-line bg-surface-raised p-6 sm:p-8">
        <CarbonScale :materiaux="isolants" />
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        <article
          v-for="famille in familles"
          :key="famille.titre"
          class="rounded-card border border-line bg-surface-raised p-6"
        >
          <AppBadge :tone="famille.ton">{{ famille.etiquette }}</AppBadge>
          <h3 class="mt-3 font-semibold text-ink">{{ famille.titre }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ famille.texte }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import CarbonScale from '@/presentation/components/ui/CarbonScale.vue';

const isolants = [
  { nom: 'Ouate de cellulose', kg: 4.8 },
  { nom: 'Chanvre', kg: 6.1 },
  { nom: 'Laine de verre', kg: 9.3 },
  { nom: 'Laine de bois', kg: 12.4 },
  { nom: 'Laine de roche', kg: 14.8 },
  { nom: 'Polystyrène', kg: 21.6 },
  { nom: 'Polyuréthane', kg: 34.2 },
];

const familles = [
  {
    etiquette: 'Géosourcé',
    ton: 'success',
    titre: 'Terre, pierre, paille',
    texte: 'Peu transformés, souvent locaux. Les plus sobres du catalogue, sous 1 kg par unité.',
  },
  {
    etiquette: 'Biosourcé',
    ton: 'accent',
    titre: 'Bois, chanvre, cellulose',
    texte: 'Le carbone capté pendant la croissance compense une part des émissions de fabrication.',
  },
  {
    etiquette: 'Pétrochimique',
    ton: 'danger',
    titre: 'Polystyrène, polyuréthane',
    texte: 'Performants au millimètre près, mais trois à sept fois plus émissifs à l’usage.',
  },
];
</script>
