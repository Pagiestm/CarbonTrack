<template>
  <section class="border-b border-line px-4 py-16 sm:px-6 sm:py-20">
    <div class="mx-auto w-full max-w-6xl">
      <h2 class="max-w-2xl text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl">
        Tout ce qu'il faut, rien de plus
      </h2>

      <dl class="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="atout in atouts" :key="atout.titre" class="flex gap-4">
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-field border border-line bg-surface-raised"
          >
            <component :is="atout.icone" class="size-4 text-accent" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <dt class="font-semibold text-ink">{{ atout.titre }}</dt>
            <dd class="mt-1.5 text-sm leading-relaxed text-ink-muted">{{ atout.texte }}</dd>
          </div>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { ChartColumn, Database, Download, FolderKanban, Scale, ShieldCheck } from 'lucide-vue-next';

const atouts = [
  {
    icone: Database,
    titre: 'Base de matériaux',
    texte: 'Empreinte, fournisseur, unité et prix, rangés par catégorie.',
  },
  {
    icone: Scale,
    titre: 'Calcul par quantité',
    texte: "L'empreinte se recalcule pendant la saisie, sans valider.",
  },
  {
    icone: ChartColumn,
    titre: 'Répartition par poste',
    texte: 'Un graphique montre quels matériaux pèsent dans le total.',
  },
  {
    icone: FolderKanban,
    titre: 'Variantes comparables',
    texte: 'Dupliquez, changez un matériau, comparez les empreintes.',
  },
  {
    icone: Download,
    titre: 'Export CSV',
    texte: 'Le détail ligne par ligne, prêt à joindre à un dossier.',
  },
  {
    icone: ShieldCheck,
    titre: 'Vos données vous appartiennent',
    texte: 'Projets privés, suppression définitive en un clic.',
  },
];
</script>
