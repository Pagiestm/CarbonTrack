<template>
    <div class="min-h-screen flex items-center justify-center bg-secondary px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl xl:w-full xl:grid xl:grid-cols-6 gap-8 p-8">
            <div class="max-w-sm w-full lg:col-span-2 flex flex-col justify-center">
                <h2 class="text-2xl font-bold text-center text-light mb-6">Inscription</h2>
                <p class="text-center text-light mb-6">Veuillez vous inscrire pour créer un compte</p>
                <form @submit.prevent="register" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-light">Nom</label>
                        <input type="text" id="name" v-model="formState.name" required
                            placeholder="Votre nom"
                            class="mt-2 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen sm:text-sm text-light bg-secondary" />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-light">Email</label>
                        <input type="email" id="email" v-model="formState.email" @input="validateEmail" required
                            placeholder="you@example.com"
                            class="mt-2 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen sm:text-sm text-light bg-secondary" />
                    </div>
                    <div v-if="formState.emailError" class="text-red-500">
                        {{ formState.emailError }}
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-light">Mot de passe</label>
                        <input type="password" id="password" v-model="formState.password" @input="validatePassword"
                            required placeholder="••••••••"
                            class="mt-2 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen sm:text-sm text-light bg-secondary" />
                        <PasswordCriteria :criteria="formState.passwordCriteria" />
                    </div>
                    <button type="submit"
                        class="w-full px-4 py-2 bg-customGreen text-white font-medium rounded-md shadow-sm hover:bg-customGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen">
                        <span v-if="!isLoading">S'inscrire</span>
                        <span v-else>Chargement...</span>
                    </button>
                    <p v-if="formState.successMessage" class="text-green-500 text-sm mt-4">{{ formState.successMessage }}</p>
                </form>
                <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
                    @close="handleCloseSuccessMessage" />
                <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
                    @close="handleCloseErrorMessage" />
                <div class="mt-6 text-center">
                    <p class="text-customGray">Vous avez déjà un compte ? <a href="/login"
                            class="text-light hover:underline">Connectez-vous</a></p>
                </div>
            </div>
            <div class="hidden xl:flex xl:items-center xl:justify-center xl:col-span-1">
                <div class="h-full w-px bg-gray-600"></div>
            </div>
            <div class="hidden xl:flex xl:items-center xl:justify-center xl:col-span-3">
                <div class="bg-primary rounded-lg shadow-lg p-8 text-center">
                    <h3 class="text-xl font-bold mb-4 text-light">Pourquoi nous choisir ?</h3>
                    <p class="mb-4 text-light">Nous offrons les meilleures solutions pour gérer vos projets efficacement
                        et en toute sécurité.</p>
                    <ul class="list-none text-left text-light">
                        <li class="mb-2"><i class="fas fa-lock mr-2"></i>Sécurité de vos données</li>
                        <li class="mb-2"><i class="fas fa-headset mr-2"></i>Support client 24/7</li>
                        <li class="mb-2"><i class="fas fa-user-friends mr-2"></i>Interface utilisateur intuitive</li>
                        <li class="mb-2"><i class="fas fa-sync-alt mr-2"></i>Mises à jour régulières</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '../services/userService';
import PasswordCriteria from '../components/Register/PasswordCriteria.vue';
import ErrorMessage from '../components/Alert/ErrorMessage.vue';
import SuccessMessage from '../components/Alert/SuccessMessage.vue';

const formState = ref({
    name: '',
    email: '',
    password: '',
    emailError: '',
    passwordCriteria: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
    },
});

const showErrorMessage = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const router = useRouter();

const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formState.value.email)) {
        formState.value.emailError = 'Le format de l\'email est invalide';
    } else {
        formState.value.emailError = '';
    }
};

const validatePassword = () => {
    const value = formState.value.password;
    formState.value.passwordCriteria.length = value.length >= 8;
    formState.value.passwordCriteria.uppercase = /[A-Z]/.test(value);
    formState.value.passwordCriteria.lowercase = /[a-z]/.test(value);
    formState.value.passwordCriteria.number = /\d/.test(value);
    formState.value.passwordCriteria.symbol = /[!@#$%^&*(),.?":{}|<>;'\[\]\\\/`~_\-+=]/.test(value);
};

const register = async () => {
    validateEmail();
    validatePassword();
    if (formState.value.emailError) {
        errorMessage.value = formState.value.emailError;
        showErrorMessage.value = true;
        return;
    }
    if (Object.values(formState.value.passwordCriteria).every(criterion => criterion)) {
        isLoading.value = true;
        try {
            await registerUser({
                name: formState.value.name,
                email: formState.value.email,
                password: formState.value.password,
            });
            successMessage.value = 'Inscription réussie !';
            showSuccessMessage.value = true;
        } catch (error) {
            errorMessage.value = 'Erreur lors de l\'inscription. Veuillez réessayer.';
            showErrorMessage.value = true;
        } finally {
            isLoading.value = false;
        }
    } else {
        errorMessage.value = 'Le mot de passe ne répond pas aux critères';
        showErrorMessage.value = true;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/login');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>