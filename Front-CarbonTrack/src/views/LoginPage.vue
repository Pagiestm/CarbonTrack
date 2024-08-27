<template>
    <div class="min-h-screen flex items-center justify-center bg-secondary px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl xl:w-full xl:grid xl:grid-cols-6 gap-8 p-8">
            <div class="max-w-sm w-full lg:col-span-2 flex flex-col justify-center">
                <h2 class="text-2xl font-bold text-center text-light mb-6">Bienvenue</h2>
                <p class="text-center text-light mb-6">Veuillez vous connecter pour accéder à votre compte</p>
                <form @submit.prevent="login" class="space-y-6">
                    <div v-if="errorMessage" class="text-red-500 text-center">
                        {{ errorMessage }}
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-light">Email</label>
                        <input type="email" id="email" v-model="formState.email" required
                            placeholder="you@example.com"
                            class="mt-2 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen sm:text-sm text-light bg-secondary" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-light">Password</label>
                        <input type="password" id="password" v-model="formState.password" required
                            placeholder="••••••••"
                            class="mt-2 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen sm:text-sm text-light bg-secondary" />
                    </div>
                    <button type="submit"
                        class="w-full px-4 py-2 bg-customGreen text-white font-medium rounded-md shadow-sm hover:bg-customGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen">
                        <span v-if="!isLoading">Connexion</span>
                        <span v-else>Chargement...</span>
                    </button>
                </form>
                <div class="mt-6 text-center">
                    <p class="text-customGray">Vous n'avez pas de compte ? <a href="/register" class="text-light hover:underline">Inscrivez-vous</a></p>
                    <p class="text-light mt-2"><a href="/password-reset/request" class="text-light hover:underline">Mot de passe oublié ?</a></p>
                </div>
            </div>
            <div class="hidden xl:flex xl:items-center xl:justify-center xl:col-span-1">
                <div class="h-full w-px bg-gray-600"></div>
            </div>
            <div class="hidden xl:flex xl:items-center xl:justify-center xl:col-span-3">
                <div class="text-center">
                    <img src="https://images.pexels.com/photos/532192/pexels-photo-532192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Description de l'image" class="mb-4 mx-auto rounded-lg w-full h-auto" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../services/userService';

const formState = ref({
    email: '',
    password: '',
});

const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();

const login = async () => {
    isLoading.value = true;
    try {
        const { token } = await loginUser({
            email: formState.value.email,
            password: formState.value.password,
        });
        localStorage.setItem('authToken', token);
        router.push('/');
    } catch (error) {
        errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
    } finally {
        isLoading.value = false;
    }
};
</script>
