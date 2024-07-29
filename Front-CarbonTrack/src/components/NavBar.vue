<template>
    <nav class="bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <router-link to="/" class="text-white text-lg font-semibold">MyApp</router-link>
            <div>
                <router-link v-if="!isAuthenticated" to="/login"
                    class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
                <router-link v-if="isAuthenticated" to="/profile"
                    class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</router-link>
                <button v-if="isAuthenticated" @click="logout"
                    class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('authToken');
});

const router = useRouter();

const logout = () => {
  localStorage.removeItem('authToken');
  isAuthenticated.value = false;
  router.push('/login');
};
</script>