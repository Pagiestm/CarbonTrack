<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen">
        <div class="container mx-auto px-4">
            <header class="mb-12 text-center lg:text-left">
                <h1 class="text-5xl font-bold text-white">Mettre à Jour le Projet</h1>
                <p class="text-lg text-gray-300 mt-4">
                    Modifiez les informations ci-dessous pour mettre à jour le projet.
                </p>
            </header>
            <div v-if="loading" class="text-center text-white">Chargement des données...</div>
            <form v-else @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
                <div class="mb-6">
                    <label for="name" class="block text-white mb-2">Nom du Projet</label>
                    <input v-model="projectData.name" type="text" id="name"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"/>
                    <FormError :message="errors.name" />
                </div>
                <div class="mb-6">
                    <label for="description" class="block text-white mb-2">Description</label>
                    <textarea v-model="projectData.description" id="description"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"></textarea>
                    <FormError :message="errors.description" />
                </div>
                <div class="mb-6">
                    <label class="block text-white mb-2">Sélectionner les Matériaux par Catégorie</label>
                    <div v-if="isLoadingCategories" class="flex justify-center items-center">
                        <span class="text-white">Chargement des catégories...</span>
                    </div>
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="category in categories" :key="category.id" class="mb-4">
                            <h3 class="text-lg font-semibold text-customGreen mb-2">{{ category.name }}</h3>
                            <div class="mb-2">
                                <select v-model="selectedMaterialId[category.id]"
                                    class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen">
                                    <option disabled value="">Sélectionner un matériau</option>
                                    <option v-for="material in category.Materials" :key="material.id"
                                        :value="material.id">
                                        {{ material.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="flex items-center mb-2 space-x-2">
                                <input v-model.number="materialQuantities[category.id]" type="number" step="1" min="0"
                                    placeholder="Quantité"
                                    class="w-24 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen" />
                                <button type="button" @click="addMaterial(category.id)"
                                    class="py-2 px-4 bg-customGreen text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                    <FormError :message="errors.quantity" />
                    <FormError :message="errors.material" />
                </div>
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
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProjectById, updateProject } from '../../services/projectsService';
import { getCategoriesWithMaterials } from '../../services/categoriesService';
import Footer from '../../components/Footer.vue';
import NavBar from '../../components/NavBar.vue';
import FormError from '../../components/Alert/FormError.vue';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;

const projectData = ref({
    name: '',
    description: '',
    materials: []
});

const categories = ref([]);
const selectedMaterialId = ref({});
const materialQuantities = ref({});
const errors = ref({});
const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const isLoadingCategories = ref(true);
const loading = ref(true);

onMounted(async () => {
    try {
        // Load categories with materials for selection
        categories.value = await getCategoriesWithMaterials();
        // Fetch the project details
        const project = await getProjectById(projectId);
        projectData.value = {
            name: project.name,
            description: project.description,
            materials: project.ProjectMaterial.map(item => ({
                materialId: item.materialId,
                quantity: item.quantity
            }))
        };
    } catch (error) {
        console.error('Erreur lors du chargement des données du projet ou des catégories', error);
    } finally {
        loading.value = false;
        isLoadingCategories.value = false;
    }
});

// Validation des champs
const validateFields = () => {
    errors.value = {};
    if (!projectData.value.name) {
        errors.value.name = 'Le nom du projet est requis.';
    }
    if (!projectData.value.description) {
        errors.value.description = 'La description est requise.';
    }
    if (projectData.value.materials.length === 0) {
        errors.value.materials = 'Veuillez ajouter au moins un matériel.';
    }
    return Object.keys(errors.value).length === 0;
};

// Ajouter un matériau
const addMaterial = (categoryId) => {
    const materialId = selectedMaterialId.value[categoryId];
    const quantity = materialQuantities.value[categoryId];

    if (materialId && quantity > 0) {
        const existingMaterial = projectData.value.materials.find(m => m.materialId === materialId);
        if (!existingMaterial) {
            projectData.value.materials.push({
                materialId: materialId,
                quantity: quantity
            });
            selectedMaterialId.value[categoryId] = '';
            materialQuantities.value[categoryId] = 0;

            // Effacer les erreurs si un matériau est ajouté correctement
            errors.value.material = '';
            errors.value.quantity = '';
        } else {
            errors.value.material = 'Ce matériau a déjà été ajouté.';
        }
    } else {
        if (!materialId) {
            errors.value.material = 'Veuillez sélectionner un matériau.';
        }
        if (quantity <= 0) {
            errors.value.quantity = 'Veuillez entrer une quantité valide.';
        }
    }
};

// Retirer un matériau
const removeMaterial = (index) => {
    projectData.value.materials.splice(index, 1);
};

// Obtenir le nom du matériau
const getMaterialName = (materialId) => {
    for (const category of categories.value) {
        const material = category.Materials.find(m => m.id === materialId);
        if (material) return material.name;
    }
    return 'Inconnu';
};

// Watchers pour effacer les erreurs lors de la correction des champs
watch(() => projectData.value.name, (newValue) => {
    if (newValue) {
        errors.value.name = '';
    }
});

watch(() => projectData.value.description, (newValue) => {
    if (newValue) {
        errors.value.description = '';
    }
});

watch(() => selectedMaterialId.value, (newValue) => {
    if (Object.values(newValue).some(id => id)) {
        errors.value.material = '';
    }
});

watch(materialQuantities, (newQuantities, oldQuantities) => {
    // Parcourt chaque catégorie pour vérifier si une quantité a été corrigée
    for (const categoryId in newQuantities) {
        if (newQuantities[categoryId] > 0) {
            errors.value.quantity = '';
            break;
        }
    }
});

watch(() => projectData.value.materials.length, () => {
    if (projectData.value.materials.length > 0) {
        errors.value.materials = '';
    }
});

// Soumission du formulaire
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
