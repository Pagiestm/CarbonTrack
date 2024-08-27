<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen">
        <div class="container mx-auto px-4">
            <header class="mb-12 text-center lg:text-left">
                <h1 class="text-5xl font-bold text-white">Réinitialisation de mot de passe</h1>
                <p class="text-lg text-gray-300 mt-4">
                    Entrez votre nouveau mot de passe ci-dessous.
                </p>
            </header>
            <div v-if="isLoading" class="text-center text-white">
                Réinitialisation en cours...
            </div>
            <div v-else>
                <form @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
                    <div class="mb-6">
                        <label for="newPassword" class="block text-white mb-2">Nouveau mot de passe</label>
                        <input v-model="newPassword" type="password" id="newPassword"
                            class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen" />
                        <FormError :message="errors.newPassword" />
                    </div>
                    <div class="mb-6">
                        <label for="confirmPassword" class="block text-white mb-2">Confirmer le mot de passe</label>
                        <input v-model="confirmPassword" type="password" id="confirmPassword"
                            class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen" />
                        <FormError :message="errors.confirmPassword" />
                    </div>
                    <button type="submit" :disabled="isLoading"
                        class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        <span v-if="isLoading">Réinitialisation...</span>
                        <span v-else>Réinitialiser</span>
                    </button>
                </form>
                <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
                    @close="handleCloseSuccessMessage" />
                <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
                    @close="handleCloseErrorMessage" />
            </div>
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';
import FormError from '../../components/Alert/FormError.vue';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';
import { resetPassword, checkToken } from '../../services/passwordResetService';

const route = useRoute();
const router = useRouter();
const token = route.query.token;

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errors = ref({});
const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
    isLoading.value = true;
    errors.value = {};
    try {
        await resetPassword(token, newPassword.value, confirmPassword.value);
        showSuccessMessage.value = true;
        successMessage.value = 'Mot de passe réinitialisé avec succès.';
    } catch (error) {
        showErrorMessage.value = true;
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/login');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};

const checkTokenValidity = async () => {
    try {
        await checkToken(token);
    } catch (error) {
        router.push('/404');
    }
};

onMounted(() => {
    checkTokenValidity();
});
</script>