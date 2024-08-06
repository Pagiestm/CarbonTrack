<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-6 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-primary underline mb-6">Modifier le Matériau</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <input v-model="localMaterial.name" placeholder="Ex: Acier"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.name" />
                </div>
                <div>
                    <input v-model="localMaterial.supplier" placeholder="Ex: Fournisseur XYZ"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.supplier" />
                </div>
                <div>
                    <input v-model="localMaterial.carbonFootprint" type="number" step="0.01" min="0"
                        placeholder="Ex: 123.45"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.carbonFootprint" />
                </div>
                <div>
                    <input v-model="localMaterial.unit" placeholder="Ex: kg"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.unit" />
                </div>
                <div>
                    <input v-model="localMaterial.pricePerUnit" type="number" step="0.01" min="0"
                        placeholder="Ex: 50.00"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.pricePerUnit" />
                </div>
                <div>
                    <select v-model="localMaterial.categoryId"
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
                        Enregistrer
                    </button>
                </div>
            </form>
            <SuccessMessage v-if="showSuccessMessage" :message="successMessage" @close="handleCloseSuccessMessage" />
            <FormError v-if="showErrorMessage" :message="errorMessage" @close="handleCloseErrorMessage" />
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { updateMaterial, getMaterialById } from '../../../services/materialsService.js';
import { getCategories } from '../../../services/categoriesService.js';
import { useRoute, useRouter } from 'vue-router';
import SuccessMessage from '../../../components/Alert/SuccessMessage.vue';
import FormError from '../../../components/Alert/FormError.vue';

const route = useRoute();
const router = useRouter();
const materialId = route.params.id;

const localMaterial = ref({
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

onMounted(async () => {
    try {
        categories.value = await getCategories();
        const material = await getMaterialById(materialId);
        localMaterial.value = { ...material };
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});

const validateForm = () => {
    errors.value = {};
    if (!localMaterial.value.name) errors.value.name = 'Le nom est requis.';
    if (!localMaterial.value.supplier) errors.value.supplier = 'Le fournisseur est requis.';
    if (!localMaterial.value.carbonFootprint) {
        errors.value.carbonFootprint = 'L\'empreinte carbone est requise.';
    } else if (localMaterial.value.carbonFootprint < 0) {
        errors.value.carbonFootprint = 'L\'empreinte carbone doit être un nombre positif.';
    }
    if (!localMaterial.value.unit) errors.value.unit = 'L\'unité est requise.';
    if (!localMaterial.value.pricePerUnit) {
        errors.value.pricePerUnit = 'Le prix par unité est requis.';
    } else if (localMaterial.value.pricePerUnit < 0) {
        errors.value.pricePerUnit = 'Le prix par unité doit être un nombre positif.';
    }
    if (!localMaterial.value.categoryId) errors.value.categoryId = 'La catégorie est requise.';
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await updateMaterial(materialId, localMaterial.value);
        successMessage.value = 'Le matériau a été mis à jour avec succès!';
        showSuccessMessage.value = true;
    } catch (error) {
        errorMessage.value = 'Erreur lors de la mise à jour du matériau. Veuillez réessayer.';
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

<style scoped>
.input-field {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 8px;
    width: 100%;
    transition: border-color 0.3s ease;
}

.input-field:focus {
    outline: none;
    border-color: #68d391;
}
</style>