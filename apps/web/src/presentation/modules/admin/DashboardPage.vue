<template>
  <div>
    <PageHeader
      eyebrow="Administration"
      title="Tableau de bord"
      subtitle="Activité de la plateforme sur l'année en cours."
    />

    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>

    <div v-if="chargement" class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppCard v-for="n in 4" :key="n"><AppSkeleton :lines="2" /></AppCard>
      </div>
      <AppCard><AppSkeleton :lines="6" /></AppCard>
    </div>

    <template v-else>
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile :icon="Users" label="Comptes" :value="utilisateurs.length" />
        <StatTile :icon="FolderKanban" label="Projets" :value="projets.length" />
        <StatTile :icon="Cloud" label="Empreinte cumulée" :value="empreinteTotale.format()" />
        <StatTile
          :icon="Gauge"
          label="Empreinte médiane"
          :value="mediane.format()"
          hint="par projet"
        />
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <AppCard
          class="lg:col-span-2"
          title="Activité mensuelle"
          subtitle="Projets créés et comptes ouverts, sur l'année en cours"
        >
          <BaseChart type="bar" :data="serieActivite" :options="optionsActivite" />
        </AppCard>

        <AppCard title="Niveau des projets" subtitle="Seuils définis par le domaine">
          <BaseChart
            type="doughnut"
            :data="serieNiveaux"
            :options="optionsAnneau({ legende: true })"
          />
        </AppCard>
      </div>

      <AppCard
        class="mt-6"
        title="Les dix projets les plus lourds"
        subtitle="Couleur selon le niveau d'empreinte"
      >
        <BaseChart
          type="bar"
          :data="serieTopProjets"
          :options="optionsBarresHorizontales()"
          height="h-96"
        />
      </AppCard>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Cloud, FolderKanban, Gauge, Users } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { Footprint } from '@/domain/entities/Footprint.js';
import {
  optionsAnneau,
  optionsBarresHorizontales,
  optionsGraphique,
} from '@/presentation/components/ui/chart-theme.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import StatTile from '@/presentation/components/ui/StatTile.vue';
import BaseChart from '@/presentation/modules/admin/components/BaseChart.vue';
import {
  empreinteMediane,
  parNiveau,
  projetsLesPlusLourds,
  serieActiviteMensuelle,
} from '@/presentation/modules/admin/components/charts.js';

const projets = ref([]);
const utilisateurs = ref([]);
const erreur = ref('');
const chargement = ref(true);

const empreinteTotale = computed(() => Footprint.somme(projets.value.map((p) => p.totalFootprint)));

const mediane = computed(() => empreinteMediane(projets.value));

const serieActivite = computed(() => serieActiviteMensuelle(projets.value, utilisateurs.value));
const serieNiveaux = computed(() => parNiveau(projets.value));
const serieTopProjets = computed(() => projetsLesPlusLourds(projets.value));

const optionsActivite = computed(() => {
  const base = optionsGraphique();
  return {
    ...base,
    plugins: {
      ...base.plugins,
      legend: { display: true, labels: { color: '#57534e', boxWidth: 12, usePointStyle: true } },
    },
  };
});

onMounted(async () => {
  try {
    const [pageProjets, pageComptes] = await Promise.all([
      useCases.projects.listAllProjects.execute({ perPage: 100 }),
      useCases.users.listUsers.execute({ perPage: 100 }),
    ]);
    projets.value = pageProjets.items;
    utilisateurs.value = pageComptes.items;
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
});
</script>
