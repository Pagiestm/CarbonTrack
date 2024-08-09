<template>
    <div class="container mx-auto p-4">
        <div v-if="loading" class="text-center text-gray-500">Chargement des détails du projet...</div>
        <div v-else-if="project" class="bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold mb-4">{{ project.name }}</h1>
            <p class="text-gray-700 mb-4">{{ project.description }}</p>
            <p class="text-gray-700 mb-4">Empreinte totale : {{ project.totalFootprint }}</p>
            <p class="text-gray-700 mb-4">Créé le : {{ new Date(project.createdAt).toLocaleDateString() }}</p>
            <h2 class="text-2xl font-semibold mb-4">Matériaux</h2>
            <ul>
                <li v-for="material in project.ProjectMaterial" :key="material.id" class="mb-2">
                    {{ material.material.name }} - Quantité : {{ material.quantity }}
                </li>
            </ul>
        </div>
        <div v-else class="text-center text-gray-500">Projet non trouvé.</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProjectById } from '../../services/projectsService';

const route = useRoute();
const projectId = route.params.id;
const project = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        project.value = await getProjectById(projectId);
    } catch (error) {
        console.error('Échec du chargement des détails du projet', error);
    } finally {
        loading.value = false;
    }
});
</script>