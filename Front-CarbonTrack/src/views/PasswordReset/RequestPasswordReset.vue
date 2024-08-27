<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen">
      <div class="container mx-auto px-4">
        <header class="mb-12 text-center lg:text-left">
          <h1 class="text-5xl font-bold text-white">Demande de réinitialisation de mot de passe</h1>
          <p class="text-lg text-gray-300 mt-4">
            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
          </p>
        </header>
        <div v-if="isLoading" class="text-center text-white">
          Envoi en cours...
        </div>
        <div v-else>
          <form @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
            <div class="mb-6">
              <label for="email" class="block text-white mb-2">Email</label>
              <input v-model="email" type="email" id="email"
                class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"/>
              <FormError :message="errors.email" />
            </div>
            <button type="submit" :disabled="isLoading"
              class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
              <span v-if="isLoading">Envoi...</span>
              <span v-else>Envoyer</span>
            </button>
          </form>
          <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
            @close="handleCloseSuccessMessage" />
          <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
            @close="handleCloseErrorMessage" />
        </div>
      </div>
    </section>
    <Footer />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import NavBar from '../../components/NavBar.vue';
  import Footer from '../../components/Footer.vue';
  import FormError from '../../components/Alert/FormError.vue';
  import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
  import ErrorMessage from '../../components/Alert/ErrorMessage.vue';
  import { requestPasswordReset } from '../../services/passwordResetService';
  
  const email = ref('');
  const isLoading = ref(false);
  const errors = ref({});
  const showSuccessMessage = ref(false);
  const successMessage = ref('');
  const showErrorMessage = ref(false);
  const errorMessage = ref('');
  
  const handleSubmit = async () => {
    isLoading.value = true;
    errors.value = {};
    try {
      await requestPasswordReset(email.value);
      successMessage.value = 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.';
      showSuccessMessage.value = true;
    } catch (error) {
      errorMessage.value = error.message;
      showErrorMessage.value = true;
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
  };
  
  const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
  };
  </script>