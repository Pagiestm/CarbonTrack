<template>
  <div>
    <div class="container mx-auto mt-10">
      <div class="mt-6 text-center">
        <h1 class="text-3xl font-bold">User Profile</h1>
        <p v-if="!user" class="mt-4 text-gray-600">Loading...</p>
        <div v-if="user">
          <p class="mt-4 text-gray-600">Name: {{ user.name }}</p>
          <p class="mt-4 text-gray-600">Email: {{ user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const isAuthenticated = ref(false);
const user = ref(null);
const errorMessage = ref('');

onMounted(async () => {
  const token = localStorage.getItem('authToken');
  isAuthenticated.value = !!token;

  if (isAuthenticated.value) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedToken = JSON.parse(jsonPayload);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://localhost:3000/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      user.value = response.data.user;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
    }
  }
});
</script>