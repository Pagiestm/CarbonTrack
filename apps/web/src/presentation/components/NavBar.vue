<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface-raised">
    <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2" @click="fermer">
        <span class="flex size-8 items-center justify-center rounded-lg bg-accent-soft">
          <Leaf class="size-4 text-accent" aria-hidden="true" />
        </span>
        <span class="text-lg font-bold text-ink">CarbonTrack</span>
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
        class="rounded-field p-2 text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink md:hidden"
        :aria-expanded="ouvert"
        aria-controls="menu-mobile"
        :aria-label="ouvert ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="ouvert = !ouvert"
      >
        <component :is="ouvert ? X : Menu" class="size-5" aria-hidden="true" />
      </button>
    </nav>
  </header>

  <Teleport to="body">
    <Transition name="voile">
      <div
        v-if="ouvert"
        class="fixed inset-0 z-60 bg-ink/40 md:hidden"
        aria-hidden="true"
        @click="fermer"
      />
    </Transition>

    <Transition name="panneau">
      <div
        v-if="ouvert"
        id="menu-mobile"
        class="fixed inset-y-0 right-0 z-70 flex w-[min(20rem,85vw)] flex-col bg-surface-raised shadow-2xl md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div class="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <span class="text-sm font-semibold text-ink-muted">Menu</span>
          <button
            ref="boutonFermer"
            type="button"
            class="rounded-field p-2 text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
            aria-label="Fermer le menu"
            @click="fermer"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </div>

        <div v-if="session.estConnecte && session.user" class="border-b border-line px-4 py-4">
          <div class="flex items-center gap-3">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
            >
              {{ session.user.initials || '?' }}
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">{{ session.user.name }}</p>
              <p class="truncate text-xs text-ink-subtle">{{ session.user.email }}</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto p-3">
          <RouterLink
            v-for="lien in liensMobile"
            :key="lien.to"
            :to="lien.to"
            class="flex items-center gap-3 rounded-field px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink [&.actif]:bg-accent-soft [&.actif]:text-accent"
            active-class="actif"
            @click="fermer"
          >
            <component :is="lien.icone" class="size-5 shrink-0" aria-hidden="true" />
            {{ lien.libelle }}
          </RouterLink>
        </nav>

        <div class="shrink-0 border-t border-line p-3">
          <AppButton
            v-if="session.estConnecte"
            variant="secondary"
            block
            :icon="LogOut"
            @click="deconnecter"
          >
            Déconnexion
          </AppButton>
          <AppButton v-else to="/login" block @click="fermer">Connexion</AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {
  FolderKanban,
  House,
  Leaf,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-vue-next';
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';

const session = useSessionStore();
const router = useRouter();
const ouvert = ref(false);
const boutonFermer = ref(null);

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

const liensMobile = computed(() => [
  { to: '/', libelle: 'Accueil', icone: House },
  ...(session.estConnecte
    ? [
        { to: '/projects', libelle: 'Mes projets', icone: FolderKanban },
        { to: '/profile', libelle: 'Profil', icone: User },
      ]
    : []),
  ...(session.estAdmin ? [{ to: '/admin', libelle: 'Administration', icone: ShieldCheck }] : []),
  { to: '/contact', libelle: 'Contact', icone: Mail },
]);

const fermer = () => {
  ouvert.value = false;
};

const deconnecter = () => {
  session.deconnecter();
  fermer();
  router.push('/login');
};

const auClavier = (e) => e.key === 'Escape' && fermer();

watch(ouvert, async (estOuvert) => {
  document.body.style.overflow = estOuvert ? 'hidden' : '';
  if (estOuvert) {
    await nextTick();
    boutonFermer.value?.focus();
  }
});

onMounted(() => {
  document.addEventListener('keydown', auClavier);
  session.recupererJetonDeLUrl();
  session.chargerProfil();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', auClavier);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.panneau-enter-active,
.panneau-leave-active {
  transition: transform 0.22s ease;
}
.panneau-enter-from,
.panneau-leave-to {
  transform: translateX(100%);
}

.voile-enter-active,
.voile-leave-active {
  transition: opacity 0.22s ease;
}
.voile-enter-from,
.voile-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .panneau-enter-active,
  .panneau-leave-active,
  .voile-enter-active,
  .voile-leave-active {
    transition: none;
  }
}
</style>
