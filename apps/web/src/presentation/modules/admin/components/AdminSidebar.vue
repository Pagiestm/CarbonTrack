<template>
  <aside
    class="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-line bg-surface-raised px-3 py-6 lg:block"
    aria-label="Navigation de l'administration"
  >
    <p class="px-3 text-xs font-semibold tracking-wide text-ink-subtle uppercase">Administration</p>
    <nav class="mt-4 space-y-1">
      <RouterLink
        v-for="lien in liens"
        :key="lien.to"
        :to="lien.to"
        class="flex items-center gap-2.5 rounded-field px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink [&.actif]:bg-accent-soft [&.actif]:text-accent"
        active-class="actif"
      >
        <component :is="lien.icone" class="size-4 shrink-0" aria-hidden="true" />
        {{ lien.libelle }}
      </RouterLink>
    </nav>
  </aside>

  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised pb-[env(safe-area-inset-bottom)] lg:hidden"
    aria-label="Navigation de l'administration"
  >
    <ul class="mx-auto flex max-w-lg">
      <li v-for="lien in liens" :key="lien.to" class="flex-1">
        <RouterLink
          :to="lien.to"
          class="flex flex-col items-center gap-1 px-1 py-2.5 text-[0.6875rem] leading-tight font-medium text-ink-subtle transition-colors [&.actif]:text-accent"
          active-class="actif"
        >
          <component :is="lien.icone" class="size-5 shrink-0" aria-hidden="true" />
          <span class="text-center">{{ lien.court }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { FolderKanban, LayoutDashboard, Package, Tags, Users } from 'lucide-vue-next';

const liens = [
  { to: '/admin/dashboard', libelle: 'Tableau de bord', court: 'Synthèse', icone: LayoutDashboard },
  { to: '/admin/projects', libelle: 'Projets', court: 'Projets', icone: FolderKanban },
  { to: '/admin/materials', libelle: 'Matériaux', court: 'Matériaux', icone: Package },
  { to: '/admin/categories', libelle: 'Catégories', court: 'Catégories', icone: Tags },
  { to: '/admin/users', libelle: 'Comptes', court: 'Comptes', icone: Users },
];
</script>
