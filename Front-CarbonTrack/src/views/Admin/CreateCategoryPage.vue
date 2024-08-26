<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-6 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-primary underline mb-6">Créer une Nouvelle Catégorie</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-primary mb-1 underline">Nom de la Catégorie :</label>
                    <input id="name" v-model="newCategory.name" placeholder="Ex: Métaux"
                        class="w-full p-3 border border-gray-300 rounded-md focus:border-customGreen focus:outline-none" />
                    <FormError :message="errors.name" />
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { createCategory } from '../../services/categoriesService.js';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';
import FormError from '../../components/Alert/FormError.vue';

// Déclaration de l'état local pour le formulaire
const newCategory = ref({
    name: ''
});

const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const errors = ref({});

const router = useRouter();

const validateForm = () => {
    errors.value = {};
    if (!newCategory.value.name) errors.value.name = 'Le nom est requis.';
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await createCategory(newCategory.value);
        successMessage.value = 'La catégorie a été créée avec succès!';
        showSuccessMessage.value = true;
    } catch (error) {
        errorMessage.value = 'Erreur lors de la création de la catégorie. Veuillez réessayer.';
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

// Watcher to clear errors when the category name is corrected
watch(() => newCategory.value.name, (newValue) => {
    if (newValue) {
        errors.value.name = '';
    }
});
</script>
