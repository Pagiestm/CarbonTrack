<template>
    <section class="max-w-2xl mx-auto mt-12 p-6 bg-primary rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-light mb-6">Créer un Nouveau Projet</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="name" class="block text-light mb-2">Nom du Projet</label>
                <input v-model="projectData.name" type="text" id="name" class="w-full p-2 rounded" required />
            </div>
            <div class="mb-4">
                <label for="description" class="block text-light mb-2">Description</label>
                <textarea v-model="projectData.description" id="description" class="w-full p-2 rounded"></textarea>
            </div>
            <div class="mb-4">
                <label for="material" class="block text-light mb-2">Matériel</label>
                <select v-model="selectedMaterialId" id="material" class="w-full p-2 rounded">
                    <option v-for="material in materials" :key="material.id" :value="material.id">
                        {{ material.name }}
                    </option>
                </select>
            </div>
            <div class="mb-4">
                <label for="quantity" class="block text-light mb-2">Quantité</label>
                <input v-model="materialQuantity" type="number" step="0.01" id="quantity" class="w-full p-2 rounded" />
            </div>
            <button type="button" @click="addMaterial"
                class="py-2 px-4 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out mb-4">
                Ajouter Matériel
            </button>
            <ul class="mb-4">
                <li v-for="(material, index) in projectData.materials" :key="index"
                    class="flex justify-between items-center mb-2">
                    <span>{{ getMaterialName(material.materialId) }} - {{ material.quantity }}</span>
                    <button type="button" @click="removeMaterial(index)"
                        class="py-1 px-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        Supprimer
                    </button>
                </li>
            </ul>
            <button type="submit"
                class="py-2 px-4 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                Créer le Projet
            </button>
        </form>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createProject } from '../../services/projectsService';
import { getMaterials } from '../../services/materialsService';

const projectData = ref({
    name: '',
    description: '',
    totalFootprint: 0,
    userId: null,
    materials: []
});

const materials = ref([]);
const selectedMaterialId = ref(null);
const materialQuantity = ref(0);

onMounted(async () => {
    try {
        materials.value = await getMaterials();
    } catch (error) {
        console.error('Échec du chargement des matériaux', error);
    }
});

const addMaterial = () => {
    if (selectedMaterialId.value && materialQuantity.value > 0) {
        const existingMaterial = projectData.value.materials.find(
            material => material.materialId === selectedMaterialId.value
        );
        if (!existingMaterial) {
            projectData.value.materials.push({
                materialId: selectedMaterialId.value,
                quantity: materialQuantity.value
            });
            selectedMaterialId.value = null;
            materialQuantity.value = 0;
        } else {
            alert('Ce matériau a déjà été ajouté.');
        }
    }
};

const removeMaterial = (index) => {
    projectData.value.materials.splice(index, 1);
};

const getMaterialName = (materialId) => {
    const material = materials.value.find(m => m.id === materialId);
    return material ? material.name : 'Inconnu';
};

const handleSubmit = async () => {
    try {
        const response = await createProject(projectData.value);
        console.log('Projet créé avec succès', response);
    } catch (error) {
        console.error('Échec de la création du projet', error);
    }
};
</script>