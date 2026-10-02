<template>
  <section class="border-b border-line px-4 py-16 sm:px-6 sm:py-20">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <p class="text-sm font-medium tracking-wide text-accent uppercase">Comment ça marche</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-ink">
            Trois étapes, pas de tableur
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-ink-muted">
            Aucune formule à écrire, aucune base carbone à télécharger.
          </p>
        </div>

        <ol class="divide-y divide-line border-y border-line">
          <li
            v-for="(etape, index) in etapes"
            :key="etape.titre"
            class="flex flex-col gap-4 py-7 sm:flex-row sm:gap-8"
          >
            <span class="shrink-0 text-sm font-bold tabular-nums text-accent">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-ink">{{ etape.titre }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-ink-muted">{{ etape.texte }}</p>
            </div>
            <p
              class="shrink-0 self-start rounded-field bg-surface-raised px-3 py-1.5 font-mono text-xs text-ink-subtle"
            >
              {{ etape.exemple }}
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
const etapes = [
  {
    titre: 'Décrivez le chantier',
    texte: 'Un nom, un type, une surface. Tout le reste est facultatif.',
    exemple: 'Extension · 40 m²',
  },
  {
    titre: 'Choisissez vos matériaux',
    texte: 'Piochez dans le catalogue par catégorie et indiquez les quantités.',
    exemple: 'Béton C25/30 × 18 m³',
  },
  {
    titre: 'Lisez le résultat',
    texte: "L'empreinte s'affiche, décomposée poste par poste, avec l'équivalent au m².",
    exemple: '12,4 t · 310 kg/m²',
  },
];
</script>
