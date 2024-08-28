<template>
    <div class="data-visualization p-6">
        <h2 class="text-2xl font-semibold mb-4 text-customGreen">Empreinte Carbone total par matériaux</h2>
        <canvas id="chart" class="h-12"></canvas>
        <div class="legend mt-4">
            <p class="text-sm text-light mb-2">Ce graphique à barres montre l'empreinte carbone totale par matériau utilisé dans le projet.</p>
            <ul class="list-disc list-inside text-sm text-light">
                <li>Chaque barre représente un matériau différent.</li>
                <li>La hauteur de la barre indique l'empreinte carbone totale.</li>
                <li>Les couleurs varient en fonction de la quantité : <br>
                    <br><span class="font-semibold">BLEU : </span> pour les matériaux à faible empreinte carbone (≤ 2 kg CO₂e/kg), 
                    <br><span class="font-semibold">ORANGE : </span> pour les matériaux à empreinte carbone modérée (2 - 10 kg CO₂e/kg), 
                    <br><span class="font-semibold">ROUGE : </span> pour les matériaux à forte empreinte carbone (> 10 kg CO₂e/kg).
                </li>
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
    const ctx = document.getElementById('chart').getContext('2d');
    const backgroundColor = props.data.map(material =>
        material.value <= 2 ? 'rgba(75, 192, 192, 0.2)' : 
            material.value <= 10 ? 'rgba(255, 159, 64, 0.2)' : 
                'rgba(255, 99, 132, 0.2)'  
    );
    const borderColor = props.data.map(material =>
        material.value <= 2 ? 'rgba(75, 192, 192, 1)' :
            material.value <= 10 ? 'rgba(255, 159, 64, 1)' :
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