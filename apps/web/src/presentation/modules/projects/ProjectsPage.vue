<template>
  <AppShell>
    <PageHeader eyebrow="Mes projets" title="Vos chantiers" :subtitle="resume">
      <template #actions>
        <AppButton to="/projects/create" :icon="Plus">Nouveau projet</AppButton>
      </template>
    </PageHeader>

    <AppAlert v-if="store.erreur" class="mb-6">{{ store.erreur }}</AppAlert>

    <div v-if="store.projets.length" class="mb-6">
      <AppField
        id="recherche"
        v-model="store.recherche"
        label="Rechercher"
        :icon="Search"
        placeholder="Nom ou description…"
        :required="false"
      />
    </div>

    <div v-if="store.chargement" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-36 animate-pulse rounded-card bg-surface-raised" />
    </div>

    <EmptyState
      v-else-if="!store.projets.length"
      :icon="FolderPlus"
      title="Aucun projet pour l'instant"
      description="Créez votre premier projet pour chiffrer l'empreinte de ses matériaux."
    >
      <AppButton to="/projects/create" :icon="Plus">Créer un projet</AppButton>
    </EmptyState>

    <EmptyState
      v-else-if="!store.filtres.length"
      :icon="SearchX"
      title="Aucun résultat"
      :description="`Rien ne correspond à « ${store.recherche} ».`"
    />

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="projet in store.filtres" :key="projet.id" :project="projet" />
    </div>
  </AppShell>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { FolderPlus, Plus, Search, SearchX } from 'lucide-vue-next';
import { useProjectsStore } from '@/presentation/stores/projects.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';
import ProjectCard from '@/presentation/modules/projects/components/ProjectCard.vue';

const store = useProjectsStore();

const resume = computed(() =>
  store.projets.length
    ? `${store.projets.length} projet${store.projets.length > 1 ? 's' : ''} · ${store.empreinteTotale.format()} eq. CO₂ au total`
    : "Chiffrez l'empreinte carbone de vos matériaux de construction.",
);

onMounted(store.charger);
</script>
