<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary">
        <div class="container mx-auto px-4">
            <header class="mb-12 text-center lg:text-left">
                <h1 class="text-5xl font-bold text-white">Mettre à jour le projet</h1>
                <p class="text-lg text-gray-300 mt-4">
                    Modifiez les informations ci-dessous pour mettre à jour le projet.
                </p>
            </header>
            <form @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
                <div class="mb-6">
                    <label for="name" class="block text-white mb-2">Nom du Projet</label>
                    <input v-model="projectData.name" type="text" id="name"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
                        required />
                    <FormError :message="errors.name" />
                </div>
                <div class="mb-6">
                    <label for="description" class="block text-white mb-2">Description</label>
                    <textarea v-model="projectData.description" id="description"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"></textarea>
                    <FormError :message="errors.description" />
                </div>
                <div class="mb-6">
                    <label for="material" class="block text-white mb-2">Matériel</label>
                    <select v-model="selectedMaterialId" id="material"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen">
                        <option v-for="material in materials" :key="material.id" :value="material.id">
                            {{ material.name }}
                        </option>
                    </select>
                    <FormError :message="errors.material" />
                </div>
                <div class="mb-6">
                    <label for="quantity" class="block text-white mb-2">Quantité</label>
                    <input v-model="materialQuantity" type="number" step="1" id="quantity"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen" />
                    <FormError :message="errors.quantity" />
                </div>
                <button type="button" @click="addMaterial"
                    class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out mb-6">
                    Ajouter Matériel
                </button>
                <ul class="mb-6">
                    <li v-for="(material, index) in projectData.materials" :key="index"
                        class="flex justify-between items-center mb-2 bg-gray-800 p-3 rounded">
                        <span class="text-light">{{ getMaterialName(material.materialId) }} - {{ material.quantity
                            }}</span>
                        <button type="button" @click="removeMaterial(index)"
                            class="py-2 px-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                            Supprimer
                        </button>
                    </li>
                </ul>
                <FormError :message="errors.materials" class="mb-2" />
                <button type="submit"
                    class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                    Mettre à Jour le Projet
                </button>
                <FormError :message="errors.submit" />
            </form>
            <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
                @close="handleCloseSuccessMessage" />
            <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
                @close="handleCloseErrorMessage" />
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProjectById, updateProject } from '../../services/projectsService';
import { getMaterials } from '../../services/materialsService';
import Footer from '../../components/Footer.vue';
import NavBar from '../../components/NavBar.vue';
import FormError from '../../components/Alert/FormError.vue';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';

const route = useRoute();
const projectId = route.params.id;
const projectData = ref({
    name: '',
    description: '',
    materials: []
});
const materials = ref([]);
const selectedMaterialId = ref(null);
const materialQuantity = ref(0);
const errors = ref({});
const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const router = useRouter();

onMounted(async () => {
    try {
        materials.value = await getMaterials();
        const projectId = route.params.id;
        const data = await getProjectById(projectId);
        projectData.value = {
            name: data.name,
            description: data.description,
            totalFootprint: data.totalFootprint,
            userId: data.userId,
            materials: data.ProjectMaterial.map(item => ({
                materialId: item.materialId,
                quantity: item.quantity
            }))
        };
    } catch (error) {
        console.error('Erreur lors du chargement des données du projet ou des matériaux', error);
    }
});

const validateFields = () => {
    errors.value = {};
    if (!projectData.value.description) {
        errors.value.description = 'La description est requise.';
    }
    if (projectData.value.materials.length === 0) {
        errors.value.materials = 'Veuillez ajouter au moins un matériel.';
    }
    return Object.keys(errors.value).length === 0;
};

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
            errors.value.material = 'Ce matériau a déjà été ajouté.';
        }
    } else {
        if (!selectedMaterialId.value) {
            errors.value.material = 'Veuillez sélectionner un matériel.';
        }
        if (materialQuantity.value <= 0) {
            errors.value.quantity = 'Veuillez entrer une quantité valide.';
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
    if (validateFields()) {
        try {
            await updateProject(projectId, projectData.value);
            successMessage.value = 'Projet mis à jour avec succès !';
            showSuccessMessage.value = true;
        } catch (error) {
            errorMessage.value = 'Échec de la mise à jour du projet. Veuillez réessayer.';
            showErrorMessage.value = true;
        }
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/projects');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>
