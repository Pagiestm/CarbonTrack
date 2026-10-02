<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-xl">
    <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="flex size-8 items-center justify-center rounded-lg bg-accent-soft">
          <Leaf class="size-4 text-accent" aria-hidden="true" />
        </span>
        <span class="font-display text-lg font-bold text-ink">CarbonTrack</span>
      </RouterLink>

      <div class="hidden items-center gap-1 md:flex">
        <RouterLink v-for="lien in liens" :key="lien.to" :to="lien.to" :class="classeLien">
          {{ lien.libelle }}
        </RouterLink>
        <AppButton
          v-if="session.estConnecte"
          variant="ghost"
          size="sm"
          :icon="LogOut"
          class="ml-1"
          @click="deconnecter"
        >
          Déconnexion
        </AppButton>
        <AppButton v-else to="/login" size="sm" class="ml-2">Connexion</AppButton>
      </div>

      <button
        type="button"
        class="rounded-field p-2 text-ink-muted hover:bg-surface-overlay hover:text-ink md:hidden"
        :aria-expanded="menuOuvert"
        aria-controls="menu-mobile"
        :aria-label="menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="menuOuvert = !menuOuvert"
      >
        <component :is="menuOuvert ? X : Menu" class="size-5" aria-hidden="true" />
      </button>
    </nav>

    <div
      v-if="menuOuvert"
      id="menu-mobile"
      class="space-y-1 border-t border-line bg-surface px-4 py-3 md:hidden"
    >
      <RouterLink
        v-for="lien in liens"
        :key="lien.to"
        :to="lien.to"
        :class="[classeLien, 'block']"
        @click="menuOuvert = false"
      >
        {{ lien.libelle }}
      </RouterLink>
      <AppButton
        v-if="session.estConnecte"
        variant="secondary"
        size="sm"
        block
        :icon="LogOut"
        @click="deconnecter"
      >
        Déconnexion
      </AppButton>
      <AppButton v-else to="/login" size="sm" block @click="menuOuvert = false">
        Connexion
      </AppButton>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Leaf, LogOut, Menu, X } from 'lucide-vue-next';
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const session = useSessionStore();
const router = useRouter();
const menuOuvert = ref(false);

const classeLien =
  'rounded-field px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink';

const liens = computed(() => [
  { to: '/contact', libelle: 'Contact' },
  ...(session.estConnecte
    ? [
        { to: '/projects', libelle: 'Mes projets' },
        { to: '/profile', libelle: 'Profil' },
      ]
    : []),
  ...(session.estAdmin ? [{ to: '/admin', libelle: 'Administration' }] : []),
]);

const deconnecter = () => {
  session.deconnecter();
  menuOuvert.value = false;
  router.push('/login');
};

// Retour de la connexion Google : le jeton arrive dans le fragment de l'URL.
onMounted(() => session.recupererJetonDeLUrl());
</script>
