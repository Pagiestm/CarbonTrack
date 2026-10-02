<template>
  <div>
    <PageHeader
      eyebrow="Administration"
      title="Tableau de bord"
      subtitle="Activité de la plateforme sur l'année en cours."
    />

    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>

    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard :icon="Users" label="Comptes" :value="utilisateurs.length" />
      <StatCard :icon="FolderKanban" label="Projets" :value="projets.length" />
      <StatCard :icon="Package" label="Matériaux" :value="catalog.materiaux.length" />
      <StatCard :icon="Tags" label="Catégories" :value="catalog.categories.length" />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <AppCard title="Projets créés" subtitle="Par mois, sur l'année en cours">
        <MonthlyChart :dates="datesProjets" label="Projets créés" />
      </AppCard>
      <AppCard title="Nouveaux comptes" subtitle="Par mois, sur l'année en cours">
        <MonthlyChart :dates="datesComptes" label="Comptes ouverts" type="line" />
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { FolderKanban, Package, Tags, Users } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import StatCard from '@/presentation/modules/admin/components/StatCard.vue';
import MonthlyChart from '@/presentation/modules/admin/components/MonthlyChart.vue';

const catalog = useCatalogStore();
const projets = ref([]);
const utilisateurs = ref([]);
const erreur = ref('');

const datesProjets = computed(() => projets.value.map((p) => p.createdAt).filter(Boolean));
const datesComptes = computed(() => utilisateurs.value.map((u) => u.createdAt).filter(Boolean));

onMounted(async () => {
  try {
    const [p, u] = await Promise.all([
      useCases.projects.listAllProjects.execute(),
      useCases.users.listUsers.execute(),
    ]);
    projets.value = p;
    utilisateurs.value = u;
    if (!catalog.materiaux.length) await catalog.charger();
  } catch (e) {
    erreur.value = e.message;
  }
});
</script>
