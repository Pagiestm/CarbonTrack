<template>
    <NavBar />
    <div class="container mx-auto mt-10 p-6">
        <div class="text-center">
            <img src="https://via.placeholder.com/150" alt="User Avatar" class="mx-auto rounded-full w-32 h-32">
            <h1 class="text-3xl font-bold text-indigo-600 mt-4">User Profile</h1>
            <p v-if="loading" class="mt-4 text-gray-600">Loading...</p>
            <div v-else>
                <div class="mt-6">
                    <p class="mt-4 text-gray-600"><i class="fas fa-user mr-2"></i>Name: {{ user.name }}</p>
                    <p class="mt-4 text-gray-600"><i class="fas fa-user mr-2"></i>Role: {{ user.role }}</p>
                    <p class="mt-4 text-gray-600"><i class="fas fa-envelope mr-2"></i>Email: {{ user.email }}</p>
                </div>
                <div class="mt-6 text-center">
                    <router-link to="/profile/edit" class="text-blue-500 hover:underline">Edit Profile</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserProfile } from '../../services/userService';
import NavBar from '../../components/NavBar.vue';

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