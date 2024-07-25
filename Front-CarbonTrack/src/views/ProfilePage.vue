<template>
    <div class="container mx-auto mt-10">
        <div class="mt-6 text-center">
            <h1 class="text-3xl font-bold">User Profile</h1>
            <p v-if="loading" class="mt-4 text-gray-600">Loading...</p>
            <div v-else>
                <p class="mt-4 text-gray-600">Name: {{ user.name }}</p>
                <p class="mt-4 text-gray-600">Email: {{ user.email }}</p>
                <router-link to="/profile/edit" class="mt-4 text-blue-500">Edit Profile</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserProfile } from '../services/userService';

const user = ref(null);
const loading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
    try {
        user.value = await getUserProfile();
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
    } finally {
        loading.value = false;
    }
});
</script>