<template>
  <section class="border-t border-line px-4 py-20 sm:px-6">
    <div class="mx-auto w-full max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-sm font-medium tracking-wide text-accent uppercase">Fonctionnalités</p>
        <h2 class="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          De la liste de matériaux au plan de réduction
        </h2>
      </div>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="atout in atouts"
          :key="atout.titre"
          class="rounded-card border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong"
        >
          <span class="flex size-10 items-center justify-center rounded-field bg-accent-soft">
            <component :is="atout.icone" class="size-5 text-accent" aria-hidden="true" />
          </span>
          <h3 class="mt-4 font-semibold text-ink">{{ atout.titre }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ atout.texte }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BarChart3, Database, FolderKanban, Lightbulb, Scale, ShieldCheck } from 'lucide-vue-next';

const atouts = [
  {
    icone: Database,
    titre: 'Base de matériaux',
    texte: 'Empreinte, fournisseur, unité et prix pour chaque matériau, rangés par catégorie.',
  },
  {
    icone: Scale,
    titre: 'Calcul par quantité',
    texte: "L'empreinte se recalcule à chaque changement de quantité, sans tableur.",
  },
  {
    icone: BarChart3,
    titre: 'Répartition par poste',
    texte: 'Un graphique montre quels matériaux pèsent vraiment dans le total.',
  },
  {
    icone: FolderKanban,
    titre: 'Projets comparables',
    texte: 'Gardez vos projets côte à côte pour mesurer les progrès entre deux variantes.',
  },
  {
    icone: Lightbulb,
    titre: 'Pistes de réduction',
    texte: 'Des leviers concrets : matériaux biosourcés, circuits courts, réemploi.',
  },
  {
    icone: ShieldCheck,
    titre: 'Vos données vous appartiennent',
    texte: 'Compte protégé, projets privés, suppression définitive en un clic.',
  },
];
</script>
