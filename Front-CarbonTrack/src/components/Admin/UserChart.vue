<template>
    <div class="user-chart">
      <h2 class="text-2xl font-semibold mb-4">Nombre d'utilisateurs inscrits par mois</h2>
      <canvas id="userChart" class="h-12"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Chart } from 'chart.js/auto';
  import { getAllUsers } from '../../services/userService';
  
  const users = ref([]);
  
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
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i).toLocaleString('default', { month: 'long' }));
    const usersByMonth = Array(12).fill(0);
  
    users.forEach(user => {
      const userDate = new Date(user.createdAt);
      if (userDate.getFullYear() === currentYear) {
        const monthIndex = userDate.getMonth();
        usersByMonth[monthIndex]++;
      }
    });
  
    return {
      labels: months,
      datasets: [{
        label: 'Utilisateurs inscrits',
        data: usersByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      }]
    };
  };
  
  onMounted(async () => {
    await fetchUsers();
    const chartData = transformDataForChart(users.value);
    const ctx = document.getElementById('userChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nombre d\'utilisateurs'
            },
            beginAtZero: true
          }
        }
      }
    });
  });
  </script>
  
  <style scoped>
  .user-chart {
    max-width: 800px;
    margin: auto;
  }
  </style>