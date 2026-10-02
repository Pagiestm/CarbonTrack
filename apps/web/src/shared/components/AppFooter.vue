<template>
  <footer class="border-t border-line bg-surface-raised">
    <div class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <p class="text-lg font-semibold text-ink">CarbonTrack</p>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            Calculez, suivez et réduisez l'empreinte carbone des matériaux de vos projets de
            construction.
          </p>
        </div>

        <nav aria-label="Liens utiles">
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
          <AppButton to="/contact" variant="secondary" size="sm" class="mt-4">
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
import AppButton from '@/shared/ui/AppButton.vue';

// Des liens de route, et non des ancres : les anciennes (#about, #features)
// ne correspondaient à aucune section de la page.
const liens = [
  { to: '/', libelle: 'Accueil' },
  { to: '/projects', libelle: 'Mes projets' },
  { to: '/profile', libelle: 'Mon profil' },
  { to: '/contact', libelle: 'Contact' },
];

const annee = new Date().getFullYear();
</script>
