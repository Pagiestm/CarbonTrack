<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-6 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-primary underline mb-6">Créer un Nouveau Matériau</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-primary mb-1 underline">Nom du Matériau : </label>
                    <input id="name" v-model="newMaterial.name" placeholder="Ex: Acier"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.name" />
                </div>
                <div>
                    <label for="supplier" class="block text-sm font-medium text-primary mb-1 underline">Fournisseur :</label>
                    <input id="supplier" v-model="newMaterial.supplier" placeholder="Ex: Fournisseur XYZ"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.supplier" />
                </div>
                <div>
                    <label for="carbonFootprint" class="block text-sm font-medium text-primary mb-1 underline">Empreinte Carbone :</label>
                    <input id="carbonFootprint" v-model.number="newMaterial.carbonFootprint" type="number" step="0.01" min="0"
                        placeholder="Ex: 123.45"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.carbonFootprint" />
                </div>
                <div>
                    <label for="unit" class="block text-sm font-medium text-primary mb-1 underline">Unité :</label>
                    <input id="unit" v-model="newMaterial.unit" placeholder="Ex: kg"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.unit" />
                </div>
                <div>
                    <label for="pricePerUnit" class="block text-sm font-medium text-primary mb-1 underline">Prix par Unité :</label>
                    <input id="pricePerUnit" v-model.number="newMaterial.pricePerUnit" type="number" step="0.01" min="0"
                        placeholder="Ex: 50.00"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.pricePerUnit" />
                </div>
                <div>
                    <label for="categoryId" class="block text-sm font-medium text-primary mb-1 underline">Catégorie :</label>
                    <select id="categoryId" v-model="newMaterial.categoryId"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none">
                        <option value="">Choisir une Catégorie</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <FormError :message="errors.categoryId" />
                </div>
                <div class="flex justify-center">
                    <button type="submit"
                        class="w-auto px-6 bg-customGreen text-white font-semibold py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                        Créer
                    </button>
                </div>
            </form>
        </div>
        <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage" @close="handleCloseSuccessMessage" />
        <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage" @close="handleCloseErrorMessage" />
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createMaterial } from '../../../services/materialsService.js';
import { getCategories } from '../../../services/categoriesService.js';
import SuccessMessage from '../../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../../components/Alert/ErrorMessage.vue';
import FormError from '../../../components/Alert/FormError.vue';

// Déclaration de l'état local pour le formulaire
const newMaterial = ref({
    name: '',
    supplier: '',
    carbonFootprint: '',
    unit: '',
    pricePerUnit: '',
    categoryId: ''
});

const categories = ref([]);
const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const errors = ref({});

const router = useRouter();

onMounted(async () => {
    categories.value = await getCategories();
});

const validateForm = () => {
    errors.value = {};
    if (!newMaterial.value.name) errors.value.name = 'Le nom est requis.';
    if (!newMaterial.value.supplier) errors.value.supplier = 'Le fournisseur est requis.';
    if (!newMaterial.value.carbonFootprint) {
        errors.value.carbonFootprint = 'L\'empreinte carbone est requise.';
    } else if (newMaterial.value.carbonFootprint < 0) {
        errors.value.carbonFootprint = 'L\'empreinte carbone doit être un nombre positif.';
    }
    if (!newMaterial.value.unit) errors.value.unit = 'L\'unité est requise.';
    if (!newMaterial.value.pricePerUnit) {
        errors.value.pricePerUnit = 'Le prix par unité est requis.';
    } else if (newMaterial.value.pricePerUnit < 0) {
        errors.value.pricePerUnit = 'Le prix par unité doit être un nombre positif.';
    }
    if (!newMaterial.value.categoryId) errors.value.categoryId = 'La catégorie est requise.';
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await createMaterial(newMaterial.value);
        successMessage.value = 'Le matériau a été créé avec succès!';
        showSuccessMessage.value = true;
    } catch (error) {
        errorMessage.value = 'Erreur lors de la création du matériau. Veuillez réessayer.';
        showErrorMessage.value = true;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/admin/materials');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>