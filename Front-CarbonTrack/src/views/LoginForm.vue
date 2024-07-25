<template>
    <form @submit.prevent="login" class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div v-if="errorMessage" class="mb-4 text-red-500">
            {{ errorMessage }}
        </div>
        <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" id="email" v-model="formState.email" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" id="password" v-model="formState.password" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit"
            class="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
    </form>
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
