<template>
    <div class="card bg-white shadow-md rounded-lg p-6">
        <div class="user-chart">
            <h2 class="text-2xl font-semibold text-customGreen mb-4">Nombre d'utilisateurs inscrits par mois</h2>
            <canvas ref="userChart" class="h-12"></canvas>
            <div class="legend mt-4">
                <p class="text-sm mb-2">Ce graphique montre le nombre d'utilisateurs inscrits chaque mois pour l'année actuelle.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';
import { getAllUsers } from '../../services/userService';

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
    const ctx = userChart.value.getContext('2d');
    chartInstance.value = new Chart(ctx, {
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