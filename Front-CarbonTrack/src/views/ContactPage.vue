<!-- src/pages/ContactPage.vue -->
<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen">
        <div class="container mx-auto px-4">
            <header class="mb-12 text-center lg:text-left">
                <h1 class="text-5xl font-bold text-white">Contactez-nous</h1>
                <p class="text-lg text-gray-300 mt-4">
                    Remplissez les informations ci-dessous pour nous contacter.
                </p>
            </header>
            <FormComponent :fields="fields" :onSubmit="handleSubmit" />
            <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
                @close="handleCloseSuccessMessage" />
            <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
                @close="handleCloseErrorMessage" />
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormComponent from '../components/FormComponent.vue';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import SuccessMessage from '../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../components/Alert/ErrorMessage.vue';
import { sendContactMessage } from '../services/contactService';

const fields = ref([
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
]);

const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const router = useRouter();

const handleSubmit = async (formData) => {
    try {
        await sendContactMessage(formData);
        successMessage.value = 'Message envoyé avec succès !';
        showSuccessMessage.value = true;
    } catch (error) {
        errorMessage.value = 'Échec de l\'envoi du message.';
        showErrorMessage.value = true;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};
</script>