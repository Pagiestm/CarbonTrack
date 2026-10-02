<template>
  <AppCard title="Projets créés" subtitle="Par mois, sur l'année en cours">
    <!-- maintainAspectRatio: false oblige à donner une hauteur au conteneur. -->
    <div class="h-72">
      <canvas ref="projectsChart"></canvas>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';
import AppCard from '@/shared/ui/AppCard.vue';
import { ACCENT, ACCENT_SOFT, moisDeLAnnee, optionsGraphique } from '@/shared/ui/chart-theme';
import { getAllProjectsForAdmin } from '@/api/projects';

const projectsData = ref([]);
const chartInstance = ref(null);
const projectsChart = ref(null);

const fetchProjects = async () => {
  try {
    const projects = await getAllProjectsForAdmin();
    projectsData.value = projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets', error);
  }
};

const transformDataForChart = (projects) => {
  const currentYear = new Date().getFullYear();
  const months = moisDeLAnnee();
  const projectsByMonth = Array(12).fill(0);

  projects.forEach((project) => {
    const projectDate = new Date(project.createdAt);
    if (projectDate.getFullYear() === currentYear) {
      const monthIndex = projectDate.getMonth();
      projectsByMonth[monthIndex]++;
    }
  });

  return {
    labels: months,
    datasets: [
      {
        label: 'Projets créés',
        data: projectsByMonth,
        backgroundColor: ACCENT_SOFT,
        borderColor: ACCENT,
        borderWidth: 1,
      },
    ],
  };
};

onMounted(async () => {
  await fetchProjects();
  const chartData = transformDataForChart(projectsData.value);
  const ctx = projectsChart.value.getContext('2d');
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: optionsGraphique({ titreAxeY: 'Projets créés' }),
  });
});
</script>
