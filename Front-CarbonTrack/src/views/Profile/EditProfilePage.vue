<template>
    <NavBar />
    <div class="container mx-auto mt-10 p-6 min-h-screen">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-indigo-600">Edit Profile</h1>
            <p v-if="loading" class="mt-4 text-gray-600">Loading...</p>
            <form v-else @submit.prevent="submitUpdateUserProfile" class="mt-6">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
                    <input v-model="user.name"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name" type="text" placeholder="Name">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                    <input v-model="user.email"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="Email">
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Update Profile
                    </button>
                </div>
            </form>
            <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';

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

const submitUpdateUserProfile = async () => {
    try {
        user.value = await updateUserProfile({
            name: user.value.name,
            email: user.value.email,
        });
        errorMessage.value = 'Profile updated successfully';
    } catch (error) {
        console.error('Failed to update user profile:', error);
        errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
    }
};
</script>