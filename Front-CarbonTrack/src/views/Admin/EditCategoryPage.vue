<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-6 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-primary underline mb-6">Modifier la Catégorie</h2>
            <div v-if="loading" class="text-center text-primary">Chargement des données...</div>
            <form v-else @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-primary mb-1 underline">Nom de la Catégorie :</label>
                    <input id="name" v-model="localCategory.name" placeholder="Ex: Métaux"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.name" />
                </div>
                <div class="flex justify-center">
                    <button type="submit"
                        class="w-auto px-6 bg-customGreen text-white font-semibold py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                        Enregistrer
                    </button>
                </div>
            </form>
            <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage" @close="handleCloseSuccessMessage" />
            <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage" @close="handleCloseErrorMessage" />
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { updateCategory, getCategoryById } from '../../services/categoriesService.js';
import { useRoute, useRouter } from 'vue-router';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';
import FormError from '../../components/Alert/FormError.vue';

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;

const localCategory = ref({
    name: ''
});

const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const errors = ref({});
const loading = ref(true);

onMounted(async () => {
    try {
        const category = await getCategoryById(categoryId);
        localCategory.value = { ...category };
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    } finally {
        loading.value = false;
    }
});

const validateForm = () => {
    errors.value = {};
    if (!localCategory.value.name) errors.value.name = 'Le nom est requis.';
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await updateCategory(categoryId, localCategory.value);
        successMessage.value = 'La catégorie a été mise à jour avec succès!';
        showSuccessMessage.value = true;
    } catch (error) {
        errorMessage.value = 'Erreur lors de la mise à jour de la catégorie. Veuillez réessayer.';
        showErrorMessage.value = true;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/admin/categories');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>