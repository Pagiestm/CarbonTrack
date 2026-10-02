<template>
  <section class="border-t border-line px-4 py-20 sm:px-6">
    <div class="mx-auto w-full max-w-6xl">
      <div class="max-w-2xl">
        <p class="text-sm font-medium tracking-wide text-accent uppercase">En trois étapes</p>
        <h2 class="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          Un chiffre en quelques minutes
        </h2>
      </div>

      <ol class="mt-12 grid gap-8 md:grid-cols-3">
        <li v-for="(etape, index) in etapes" :key="etape.titre" class="relative">
          <span
            class="flex size-9 items-center justify-center rounded-full border border-accent/30 bg-accent-soft font-display text-sm font-bold text-accent"
          >
            {{ index + 1 }}
          </span>
          <h3 class="mt-4 font-semibold text-ink">{{ etape.titre }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ etape.texte }}</p>
        </li>
      </ol>

      <div
        class="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-card border border-accent/20 bg-accent-soft p-8"
      >
        <div>
          <h3 class="font-display text-2xl font-bold text-ink">
            Prêt à chiffrer votre projet&nbsp;?
          </h3>
          <p class="mt-2 text-sm text-ink-muted">Création de compte gratuite, aucun engagement.</p>
        </div>
        <AppButton :to="session.estConnecte ? '/projects/create' : '/register'" size="lg">
          {{ session.estConnecte ? 'Créer un projet' : 'Créer mon compte' }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const session = useSessionStore();

const etapes = [
  {
    titre: 'Décrivez le projet',
    texte: 'Un nom, une description, et vous pouvez commencer à composer.',
  },
  {
    titre: 'Choisissez vos matériaux',
    texte: 'Piochez dans le catalogue par catégorie et indiquez les quantités.',
  },
  {
    titre: 'Lisez le résultat',
    texte: "L'empreinte totale s'affiche, décomposée poste par poste.",
  },
];
</script>
