<template>
    <form @submit.prevent="register" class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" id="name" v-model="formState.name" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" id="email" v-model="formState.email" @input="validateEmail" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <p v-if="formState.emailError" class="text-red-500 text-sm mt-1">{{ formState.emailError }}</p>
        </div>
        <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" id="password" v-model="formState.password" @input="validatePassword" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <PasswordCriteria :criteria="formState.passwordCriteria" />
        </div>
        <button type="submit"
            class="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</button>
        <p v-if="formState.successMessage" class="text-green-500 text-sm mt-4">{{ formState.successMessage }}</p>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import PasswordCriteria from '../components/PasswordCriteria.vue';

const formState = ref({
    name: '',
    email: '',
    password: '',
    successMessage: '',
    emailError: '',
    passwordCriteria: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
    },
});

const router = useRouter();

const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formState.value.email)) {
        formState.value.emailError = 'Invalid email format';
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
    formState.value.passwordCriteria.symbol = /[@$!%*?&]/.test(value);
};

const register = async () => {
    validatePassword();
    if (Object.values(passwordCriteria.value).every(criterion => criterion)) {
        try {
            const response = await axios.post('http://localhost:3000/auth/register', {
                name: name.value,
                email: email.value,
                password: password.value,
            });
            successMessage.value = 'Registration successful! Redirecting to homepage...';
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    } else {
        console.error('Password does not meet criteria');
    }
};
</script>