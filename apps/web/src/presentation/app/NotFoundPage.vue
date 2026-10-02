<template>
  <AppShell>
    <div class="py-16 text-center">
      <p class="font-display text-7xl font-bold text-accent">404</p>
      <h1 class="mt-4 font-display text-3xl font-bold text-ink">Cette page n'existe pas</h1>
      <p class="mx-auto mt-3 max-w-md text-ink-muted">
        Le lien est peut-être périmé, ou la page a changé d'adresse.
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <AppButton to="/" :icon="House">Retour à l'accueil</AppButton>
        <AppButton to="/contact" variant="secondary">Nous signaler le souci</AppButton>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { House } from 'lucide-vue-next';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
</script>
