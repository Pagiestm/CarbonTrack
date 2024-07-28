<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-center text-indigo-600 mb-6">Bienvenue</h2>
            <p class="text-center text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre compte</p>
            <form @submit.prevent="login" class="space-y-6">
                <div v-if="errorMessage" class="text-red-500 text-center">
                    {{ errorMessage }}
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                    <input type="email" id="email" v-model="formState.email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" v-model="formState.password" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit"
                    class="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
            </form>
            <div class="mt-6 text-center">
                <p class="text-gray-600">Vous n'avez pas de compte ? <a href="/register" class="text-indigo-600 hover:underline">Inscrivez-vous</a></p>
                <p class="text-gray-600 mt-2"><a href="/forgot-password" class="text-indigo-600 hover:underline">Mot de passe oublié ?</a></p>
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

const router = useRouter();

const login = async () => {
    try {
        const { token } = await loginUser({
            email: formState.value.email,
            password: formState.value.password,
        });
        localStorage.setItem('authToken', token);
        router.push('/');
    } catch (error) {
        errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
    }
};
</script>
