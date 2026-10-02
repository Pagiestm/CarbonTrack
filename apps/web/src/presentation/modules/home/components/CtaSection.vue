<template>
  <section class="px-4 py-20 sm:px-6 sm:py-24">
    <div class="mx-auto w-full max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl">
        Prêt à chiffrer votre projet&nbsp;?
      </h2>
      <p class="mt-4 text-ink-muted">Création de compte gratuite, aucun engagement.</p>
      <AppButton
        :to="session.estConnecte ? '/projects/create' : '/register'"
        size="lg"
        class="mt-8 w-full sm:w-auto"
      >
        {{ session.estConnecte ? 'Créer un projet' : 'Créer mon compte' }}
      </AppButton>
    </div>
  </section>
</template>

<script setup>
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const session = useSessionStore();
</script>
