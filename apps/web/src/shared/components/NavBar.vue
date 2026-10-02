<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
    <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink to="/" class="text-lg font-bold tracking-tight text-ink">
        Carbon<span class="text-accent">Track</span>
      </RouterLink>

      <div class="hidden items-center gap-1 md:flex">
        <RouterLink v-for="lien in liens" :key="lien.to" :to="lien.to" :class="classeLien">
          {{ lien.libelle }}
        </RouterLink>
        <AppButton v-if="isAuthenticated" variant="ghost" size="sm" @click="logout">
          Déconnexion
        </AppButton>
        <AppButton v-else to="/login" size="sm" class="ml-2">Connexion</AppButton>
      </div>

      <button
        type="button"
        class="rounded-lg p-2 text-ink-muted hover:bg-surface-overlay hover:text-ink md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="menu-mobile"
        aria-label="Ouvrir le menu"
        @click="menuOpen = !menuOpen"
      >
        <svg class="size-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            :d="menuOpen ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'"
          />
        </svg>
      </button>
    </nav>

    <div
      v-if="menuOpen"
      id="menu-mobile"
      class="border-t border-line bg-surface px-4 py-3 md:hidden"
    >
      <RouterLink
        v-for="lien in liens"
        :key="lien.to"
        :to="lien.to"
        :class="[classeLien, 'block']"
        @click="menuOpen = false"
      >
        {{ lien.libelle }}
      </RouterLink>
      <AppButton
        v-if="isAuthenticated"
        variant="ghost"
        size="sm"
        block
        class="mt-2 justify-start"
        @click="logout"
      >
        Déconnexion
      </AppButton>
      <AppButton v-else to="/login" size="sm" block class="mt-2" @click="menuOpen = false">
        Connexion
      </AppButton>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {
  clearSession,
  consumeTokenFromUrl,
  isAdmin as checkIsAdmin,
  isAuthenticated as checkIsAuthenticated,
} from '@/shared/auth/session';
import AppButton from '@/shared/ui/AppButton.vue';

const isAuthenticated = ref(false);
const isAdmin = ref(false);
const menuOpen = ref(false);
const router = useRouter();

const classeLien =
  'rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink';

const liens = computed(() => [
  { to: '/contact', libelle: 'Contact' },
  ...(isAuthenticated.value
    ? [
        { to: '/projects', libelle: 'Mes projets' },
        { to: '/profile', libelle: 'Profil' },
      ]
    : []),
  ...(isAdmin.value ? [{ to: '/admin', libelle: 'Administration' }] : []),
]);

const logout = () => {
  clearSession();
  isAuthenticated.value = false;
  isAdmin.value = false;
  menuOpen.value = false;
  router.push('/login');
};

onMounted(() => {
  consumeTokenFromUrl();
  isAuthenticated.value = checkIsAuthenticated();
  isAdmin.value = isAuthenticated.value && checkIsAdmin();
});
</script>
