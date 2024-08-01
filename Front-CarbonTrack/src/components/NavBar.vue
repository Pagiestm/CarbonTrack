<template>
    <nav class="bg-gray-800 p-4 shadow-md fixed top-0 w-full z-50">
        <div class="container mx-auto flex justify-between items-center">
            <router-link to="/" class="text-white text-xl font-semibold">CarbonTrack</router-link>
            <div class="hidden md:flex">
                <!-- Desktop Links -->
                <router-link v-if="!isAuthenticated" to="/login"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Connexion</router-link>
                <router-link v-if="isAuthenticated" to="/profile"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Profil</router-link>
                <router-link v-if="isAuthenticated && isAdmin" to="/admin"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Admin</router-link>
                <button v-if="isAuthenticated" @click="logout"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Déconnexion</button>
            </div>
            <div class="md:hidden">
                <!-- Burger Button for Mobile -->
                <button @click="toggleMenu" class="text-white focus:outline-none">
                    <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div v-if="menuOpen"
            class="fixed top-0 left-0 w-full h-full bg-secondary flex flex-col justify-between p-4 transition-transform transform md:hidden"
            :class="{ 'translate-x-0': menuOpen, '-translate-x-full': !menuOpen }">
            <div class="flex justify-between items-center mb-4">
                <router-link to="/" class="text-white text-xl font-semibold">CarbonTrack</router-link>
                <button @click="toggleMenu" class="text-white">
                    <!-- Close Button -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex flex-col">
                <router-link v-if="!isAuthenticated" to="/login"
                    class="text-customGreen py-3 rounded-md text-xl font-medium transition duration-300 mb-2 flex items-center justify-between"
                    @click="toggleMenu">
                    Connexion
                    <svg class="w-6 h-6 ml-2 text-customGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </router-link>
                <router-link v-if="isAuthenticated" to="/profile"
                    class="text-customGreen py-3 rounded-md text-xl font-medium transition duration-300 mb-2 flex items-center justify-between"
                    @click="toggleMenu">
                    Profil
                    <svg class="w-6 h-6 ml-2 text-customGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </router-link>
                <router-link v-if="isAuthenticated && isAdmin" to="/admin"
                    class="text-customGreen py-3 rounded-md text-xl font-medium transition duration-300 mb-2 flex items-center justify-between"
                    @click="toggleMenu">
                    Admin
                    <svg class="w-6 h-6 ml-2 text-customGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </router-link>
            </div>
            <div class="mt-auto">
                <button v-if="isAuthenticated" @click="logout"
                    class="text-customGreen py-2 rounded-md text-lg font-medium transition duration-300 mb-2 flex items-center justify-between">
                    Déconnexion
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const isAdmin = ref(false);
const menuOpen = ref(false);

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

onMounted(() => {
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    isAuthenticated.value = !!authToken;
    isAdmin.value = role === 'ADMIN';
});

const router = useRouter();

const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    isAuthenticated.value = false;
    isAdmin.value = false;
    menuOpen.value = false;
    router.push('/login');
};
</script>