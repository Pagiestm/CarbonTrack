<template>
  <aside
    class="hidden w-60 shrink-0 border-r border-line bg-surface-raised px-3 py-6 lg:block"
    aria-label="Navigation de l'administration"
  >
    <p class="px-3 text-xs font-semibold tracking-wide text-ink-subtle uppercase">Administration</p>
    <nav class="mt-4 space-y-1">
      <RouterLink
        v-for="lien in liens"
        :key="lien.to"
        :to="lien.to"
        class="flex items-center gap-2.5 rounded-field px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
        active-class="bg-accent-soft text-accent"
      >
        <component :is="lien.icone" class="size-4" aria-hidden="true" />
        {{ lien.libelle }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { LayoutDashboard, Package, Tags } from 'lucide-vue-next';

const liens = [
  { to: '/admin/dashboard', libelle: 'Tableau de bord', icone: LayoutDashboard },
  { to: '/admin/materials', libelle: 'Matériaux', icone: Package },
  { to: '/admin/categories', libelle: 'Catégories', icone: Tags },
];
</script>
