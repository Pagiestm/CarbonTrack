<template>
    <div class="data-visualization p-6">
        <h2 class="text-2xl font-semibold mb-4 text-customGreen">Comparaison des matériaux utilisés</h2>
        <canvas id="radarChart" class="h-12"></canvas>
        <div class="text-sm legend mt-4">
            <p class="text-light mb-2">Ce graphique en radar compare les quantités de différents matériaux utilisés dans le projet.</p>
            <ul class="list-disc list-inside text-light">
                <li>Chaque axe représente un matériau différent.</li>
                <li>La distance du centre indique la quantité utilisée.</li>
                <li>Les valeurs plus proches du bord indiquent une plus grande quantité.</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
    data: Array
});

onMounted(() => {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const backgroundColor = 'rgba(75, 192, 192, 0.2)';
    const borderColor = 'rgba(75, 192, 192, 1)';

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: props.data.map(material => material.name),
            datasets: [{
                label: 'Quantité de matériaux',
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
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: Math.max(...props.data.map(material => material.value)) + 10
                }
            }
        }
    });
});
</script>