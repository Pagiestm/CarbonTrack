<template>
  <AppShell>
    <PageHeader eyebrow="Mes projets" title="Vos chantiers" :subtitle="resume">
      <template #actions>
        <AppButton to="/projects/create" :icon="Plus">Nouveau projet</AppButton>
      </template>
    </PageHeader>

    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>

    <div v-if="statistiques" class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile :icon="FolderKanban" label="Projets" :value="resultat.total" />
      <StatTile
        :icon="Cloud"
        label="Empreinte cumulée"
        :value="statistiques.total.format()"
        hint="sur la page affichée"
      />
      <StatTile
        :icon="Ruler"
        label="Surface cumulée"
        :value="`${statistiques.surface.toLocaleString('fr-FR')} m²`"
        hint="sur la page affichée"
      />
      <StatTile
        :icon="Gauge"
        label="Moyenne au m²"
        :value="statistiques.parM2 ? statistiques.parM2.format() : '—'"
        hint="sur la page affichée"
      />
    </div>

    <div class="mb-6 max-w-sm">
      <AppField
        id="recherche"
        v-model="recherche"
        label="Rechercher"
        :icon="Search"
        placeholder="Nom, description ou lieu…"
        :required="false"
      />
    </div>

    <div v-if="chargement" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AppCard v-for="n in 6" :key="n"><AppSkeleton :lines="4" /></AppCard>
    </div>

    <EmptyState
      v-else-if="resultat.isEmpty && !recherche"
      :icon="FolderPlus"
      title="Aucun projet pour l'instant"
      description="Créez votre premier projet pour chiffrer l'empreinte de ses matériaux."
    >
      <AppButton to="/projects/create" :icon="Plus">Créer un projet</AppButton>
    </EmptyState>

    <EmptyState
      v-else-if="resultat.isEmpty"
      :icon="SearchX"
      title="Aucun résultat"
      :description="`Rien ne correspond à « ${recherche} ».`"
    />

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="projet in resultat.items" :key="projet.id" :project="projet" />
      </div>

      <AppPagination v-model="page" :page="resultat" :loading="chargement" class="mt-8" />
    </template>
  </AppShell>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import {
  Cloud,
  FolderKanban,
  FolderPlus,
  Gauge,
  Plus,
  Ruler,
  Search,
  SearchX,
} from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { Footprint } from '@/domain/entities/Footprint.js';
import { usePagedList } from '@/presentation/composables/usePagedList.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import AppPagination from '@/presentation/components/ui/AppPagination.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';
import StatTile from '@/presentation/components/ui/StatTile.vue';
import ProjectCard from '@/presentation/modules/projects/components/ProjectCard.vue';

const { resultat, page, recherche, chargement, erreur, rafraichir } = usePagedList(
  (options) => useCases.projects.listProjects.execute(options),
  { perPage: 9 },
);

const resume = computed(() =>
  resultat.value.total
    ? `${resultat.value.total} projet${resultat.value.total > 1 ? 's' : ''} enregistré${resultat.value.total > 1 ? 's' : ''}.`
    : "Chiffrez l'empreinte carbone de vos matériaux de construction.",
);

const statistiques = computed(() => {
  const projets = resultat.value.items;
  if (!projets.length) return null;

  const total = Footprint.somme(projets.map((p) => p.totalFootprint));
  const surface = projets.reduce((somme, p) => somme + (p.surface ?? 0), 0);
  return {
    total,
    surface: Math.round(surface),
    parM2: surface ? new Footprint(total.kg / surface) : null,
  };
});

onMounted(rafraichir);
</script>
