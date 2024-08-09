<template>
    <div class="data-visualization p-6">
        <h2 class="text-2xl font-semibold mb-4 text-customGreen">Empreinte Carbone total par matériaux</h2>
        <canvas id="chart" class="h-12"></canvas>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
    data: Array
});

onMounted(() => {
    const ctx = document.getElementById('chart').getContext('2d');
    const backgroundColor = props.data.map(material =>
        material.value <= 50 ? 'rgba(75, 192, 192, 0.2)' :
            material.value <= 100 ? 'rgba(255, 159, 64, 0.2)' :
                'rgba(255, 99, 132, 0.2)'
    );
    const borderColor = props.data.map(material =>
        material.value <= 50 ? 'rgba(75, 192, 192, 1)' :
            material.value <= 100 ? 'rgba(255, 159, 64, 1)' :
                'rgba(255, 99, 132, 1)'
    );

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: props.data.map(material => material.name),
            datasets: [{
                label: 'Matériaux',
                data: props.data.map(material => material.value),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.raw !== null ? context.raw : '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
</script>