<template>
    <nav class="bg-gray-800 p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
            <router-link to="/" class="text-white text-xl font-semibold">CarbonTrack</router-link>
            <div>
                <router-link v-if="!isAuthenticated" to="/login"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Login</router-link>
                <router-link v-if="isAuthenticated" to="/profile"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Profile</router-link>
                <router-link v-if="isAuthenticated && isAdmin" to="/admin"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Admin</router-link>
                <button v-if="isAuthenticated" @click="logout"
                    class="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const isAdmin = ref(false);

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
  router.push('/login');
};
</script>