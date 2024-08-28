<template>
    <div class="data-visualization p-6">
        <h2 class="text-2xl font-semibold mb-4 text-customGreen">Projets créés par mois pour l'année actuelle</h2>
        <canvas id="projectsChart" class="h-12"></canvas>
        <div class="legend mt-4">
            <p class="text-sm text-light mb-2">Ce graphique montre le nombre de projets créés chaque mois pour l'année actuelle.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';
import { getAllProjectsForAdmin } from '../../services/projectsService';

const projectsData = ref([]);

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
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i).toLocaleString('default', { month: 'long' }));
    const projectsByMonth = Array(12).fill(0);

    projects.forEach(project => {
        const projectDate = new Date(project.createdAt);
        if (projectDate.getFullYear() === currentYear) {
            const monthIndex = projectDate.getMonth();
            projectsByMonth[monthIndex]++;
        }
    });

    return {
        labels: months,
        datasets: [{
            label: 'Projets créés',
            data: projectsByMonth,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
};

onMounted(async () => {
    await fetchProjects();
    const chartData = transformDataForChart(projectsData.value);
    const ctx = document.getElementById('projectsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
</script>

<style scoped>
.data-visualization {
    max-width: 800px;
    margin: 0 auto;
}
</style>