<template>
  <AppCard title="Nouveaux comptes" subtitle="Par mois, sur l'année en cours">
    <div class="h-72">
      <canvas ref="userChart"></canvas>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';
import AppCard from '@/shared/ui/AppCard.vue';
import { ACCENT, ACCENT_SOFT, moisDeLAnnee, optionsGraphique } from '@/shared/ui/chart-theme';
import { getAllUsers } from '@/api/users';

const users = ref([]);
const chartInstance = ref(null);
const userChart = ref(null);

const fetchUsers = async () => {
  try {
    const userList = await getAllUsers();
    users.value = userList;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
  }
};

const transformDataForChart = (users) => {
  const currentYear = new Date().getFullYear();
  const months = moisDeLAnnee();
  const usersByMonth = Array(12).fill(0);

  users.forEach((user) => {
    const userDate = new Date(user.createdAt);
    if (userDate.getFullYear() === currentYear) {
      const monthIndex = userDate.getMonth();
      usersByMonth[monthIndex]++;
    }
  });

  return {
    labels: months,
    datasets: [
      {
        label: 'Utilisateurs inscrits',
        data: usersByMonth,
        backgroundColor: ACCENT_SOFT,
        borderColor: ACCENT,
        borderWidth: 1,
        fill: false,
        tension: 0.1,
      },
    ],
  };
};

onMounted(async () => {
  await fetchUsers();
  const chartData = transformDataForChart(users.value);
  const ctx = userChart.value.getContext('2d');
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: optionsGraphique({ titreAxeY: "Nombre d'utilisateurs" }),
  });
});
</script>
