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
            <div v-if="isLoading" class="text-center text-white">
                Chargement des données...
            </div>
            <div v-else>
                <form @submit.prevent="handleSubmit" class="bg-primary p-8 rounded-lg shadow-lg">
                    <div class="mb-6">
                        <label for="name" class="block text-white mb-2">Nom</label>
                        <input v-model="formData.name" type="text" id="name"
                            class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
                            required />
                        <FormError :message="errors.name" />
                    </div>
                    <div class="mb-6">
                        <label for="email" class="block text-white mb-2">Email</label>
                        <input v-model="formData.email" type="email" id="email"
                            class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
                            required />
                        <FormError :message="errors.email" />
                    </div>
                    <div class="mb-6">
                        <label for="message" class="block text-white mb-2">Message</label>
                        <textarea v-model="formData.message" id="message"
                            class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
                            required></textarea>
                        <FormError :message="errors.message" />
                    </div>
                    <button type="submit" :disabled="isLoading"
                        class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        <span v-if="isLoading">Chargement...</span>
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import SuccessMessage from '../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../components/Alert/ErrorMessage.vue';
import FormError from '../components/Alert/FormError.vue';
import { sendContactMessage } from '../services/contactService';
import { getUserProfile } from '../services/userService';

const formData = ref({
    name: '',
    email: '',
    message: ''
});

const errors = ref({});
const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
    isLoading.value = true;
    try {
        const userInfo = await getUserProfile();
        formData.value.name = userInfo.name;
        formData.value.email = userInfo.email;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
    } finally {
        isLoading.value = false;
    }
});

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateFields = () => {
    errors.value = {};
    if (!formData.value.name) {
        errors.value.name = 'Le nom est requis.';
    }
    if (!formData.value.email) {
        errors.value.email = 'L\'email est requis.';
    } else if (!validateEmail(formData.value.email)) {
        errors.value.email = 'Le format de l\'email est invalide.';
    }
    if (!formData.value.message) {
        errors.value.message = 'Le message est requis.';
    }
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (validateFields()) {
        isLoading.value = true;
        try {
            await sendContactMessage(formData.value);
            successMessage.value = 'Message envoyé avec succès !';
            showSuccessMessage.value = true;
        } catch (error) {
            errorMessage.value = 'Échec de l\'envoi du message.';
            showErrorMessage.value = true;
        } finally {
            isLoading.value = false;
        }
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