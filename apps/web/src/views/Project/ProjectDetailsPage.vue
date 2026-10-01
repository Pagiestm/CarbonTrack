<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary flex justify-center min-h-screen">
        <div class="container px-4 md:px-6 xl:flex xl:space-x-12 items-start">
            <div v-if="loading" class="text-center text-customGray">Chargement des détails du projet...</div>
            <div v-else-if="project" class="w-full xl:w-1/2 mb-8 xl:mb-0">
                <h1 class="text-4xl font-bold mb-6 text-customGreen">{{ project.name }}</h1>
                <p class="text-light mb-4">{{ project.description }}</p>
                <div class="mb-6">
                    <div class="mb-4">
                        <p class="text-lg font-semibold text-light">Empreinte totale :</p>
                        <p class="text-2xl font-bold text-customGreen">{{ project.totalFootprint }} kg CO₂</p>
                    </div>
                    <div>
                        <p class="text-lg font-semibold text-light">Créé le :</p>
                        <p class="text-2xl font-bold text-customGreen">{{ new Date(project.createdAt).toLocaleDateString() }}</p>
                    </div>
                </div>
                <h2 class="text-3xl font-semibold mb-4 text-customGreen">Matériaux Utilisés</h2>
                <ul class="mb-8 border-t border-customGray">
                    <li v-for="material in project.ProjectMaterial" :key="material.id"
                        class="py-4 border-b border-customGray flex justify-between items-center">
                        <span class="text-light font-medium">{{ material.material.name }}</span>
                        <span class="text-customGray">Quantité : {{ material.quantity }}</span>
                    </li>
                </ul>
                <div class="mb-8">
                    <h3 class="text-2xl font-semibold text-customGreen">Recommandations pour réduire l'empreinte carbone</h3>
                    <p class="text-light mt-2">Les matériaux utilisés peuvent être modifiés pour réduire l'empreinte carbone. Voici quelques recommandations :</p>
                    <ul class="list-disc list-inside text-light mt-2">
                        <li>Utiliser des matériaux recyclés ou recyclables.</li>
                        <li>Choisir des matériaux locaux pour réduire les émissions liées au transport.</li>
                        <li>Opter pour des matériaux à faible émission de CO₂, comme le bois certifié FSC.</li>
                        <li>Éviter les matériaux à forte intensité énergétique, comme l'aluminium et le béton.</li>
                        <li>Privilégier les matériaux durables et de longue durée de vie.</li>
                    </ul>
                </div>
            </div>
            <div v-if="project" class="w-full xl:w-1/2">
                <MaterialDistributionChart :data="formattedData" class="bg-primary rounded-lg shadow-lg mb-4"/>
                <DataVisualization :data="formattedData" class="bg-primary rounded-lg shadow-lg"/>
            </div>
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProjectById } from '../../services/projectsService';
import DataVisualization from '../../components/Project/DataVisualization.vue';
import MaterialDistributionChart from '../../components/Project/MaterialDistributionChart.vue';
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;
const project = ref(null);
const loading = ref(true);
const formattedData = ref([]);

onMounted(async () => {
    try {
        project.value = await getProjectById(projectId);
        console.log('Project data:', project.value);

        formattedData.value = project.value.ProjectMaterial.map(pm => ({
            name: pm.material.name,
            value: pm.material.carbonFootprint * pm.quantity
        }));
        console.log('Formatted data for DataVisualization:', formattedData.value);
        document.title = `CarbonTrack - ${project.value.name}`;
    } catch (error) {
        console.error('Échec du chargement des détails du projet', error);
        router.push({ name: 'NotFound' });
    } finally {
        loading.value = false;
    }
});
</script>