<template>
  <div>
    <nav class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-lg font-semibold">MyApp</div>
        <div>
          <router-link to="/"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</router-link>
          <router-link v-if="!isAuthenticated" to="/login"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
          <router-link v-if="isAuthenticated" to="/profile"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</router-link>
          <button v-if="isAuthenticated" @click="logout"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
        </div>
      </div>
    </nav>
    <div class="container mx-auto mt-10">
      <div class="mt-6 text-center">
        <h1 class="text-3xl font-bold">Welcome to MyApp</h1>
        <p class="mt-4 text-gray-600">This is a simple homepage to verify user login status.</p>
        <p v-if="isAuthenticated" class="mt-4 text-green-600">You are logged in!</p>
      </div>
    </div>
  </div>
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