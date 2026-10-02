<template>
  <footer class="border-t border-line bg-surface-raised">
    <div class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-lg bg-accent-soft">
              <Leaf class="size-4 text-accent" aria-hidden="true" />
            </span>
            <span class="text-lg font-bold text-ink">CarbonTrack</span>
          </div>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            Calculez, suivez et réduisez l'empreinte carbone des matériaux de vos projets de
            construction.
          </p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <h2 class="text-sm font-semibold text-ink">Navigation</h2>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li v-for="lien in liens" :key="lien.to">
              <RouterLink :to="lien.to" class="text-ink-muted transition-colors hover:text-ink">
                {{ lien.libelle }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="text-sm font-semibold text-ink">Une question&nbsp;?</h2>
          <p class="mt-4 text-sm text-ink-muted">
            Écrivez-nous, nous répondons sous quelques jours.
          </p>
          <AppButton to="/contact" variant="secondary" size="sm" :icon="Mail" class="mt-4">
            Nous contacter
          </AppButton>
        </div>
      </div>

      <p class="mt-10 border-t border-line pt-6 text-sm text-ink-subtle">
        © {{ annee }} CarbonTrack. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>


<script setup>
import { RouterLink } from 'vue-router';
import { Leaf, Mail } from 'lucide-vue-next';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const liens = [
  { to: '/', libelle: 'Accueil' },
  { to: '/projects', libelle: 'Mes projets' },
  { to: '/profile', libelle: 'Mon profil' },
  { to: '/contact', libelle: 'Contact' },
];

const annee = new Date().getFullYear();
</script>

