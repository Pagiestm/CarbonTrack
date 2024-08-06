<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-8 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-indigo-600 mb-6">Créer un Nouveau Matériau</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <input v-model="newMaterial.name" placeholder="Nom" class="input-field" />
                </div>
                <div>
                    <input v-model="newMaterial.supplier" placeholder="Fournisseur" class="input-field" />
                </div>
                <div>
                    <input v-model="newMaterial.carbonFootprint" placeholder="Empreinte Carbone" class="input-field" />
                </div>
                <div>
                    <input v-model="newMaterial.unit" placeholder="Unité" class="input-field" />
                </div>
                <div>
                    <input v-model="newMaterial.pricePerUnit" placeholder="Prix par Unité" class="input-field" />
                </div>
                <div>
                    <select v-model="newMaterial.categoryId" class="input-field">
                        <option value="">Choisir une Catégorie</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <button type="submit"
                    class="w-full bg-customGreen text-white font-semibold py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                    Créer
                </button>
            </form>
        </div>
        <SuccessMessage v-if="showSuccessMessage" :message="successMessage" @close="handleCloseSuccessMessage" />
        <ErrorMessage v-if="showErrorMessage" :message="errorMessage" @close="handleCloseErrorMessage" />
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createMaterial } from '../../../services/materialsService.js';
import { getCategories } from '../../../services/categoriesService.js';
import SuccessMessage from '../../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../../components/Alert/ErrorMessage.vue';

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
const router = useRouter();

onMounted(async () => {
    categories.value = await getCategories();
});

const handleSubmit = async () => {
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
    router.push('/materials');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>