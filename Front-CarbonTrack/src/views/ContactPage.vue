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
                <FormComponent :fields="fields" :onSubmit="handleSubmit" :errors="formErrors" :initialData="initialData" :isLoading="isLoading" />
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FormComponent from '../components/FormComponent.vue';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import SuccessMessage from '../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../components/Alert/ErrorMessage.vue';
import { sendContactMessage } from '../services/contactService';
import { getUserProfile } from '../services/userService';

const fields = ref([
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
]);

const showSuccessMessage = ref(false);
const successMessage = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');
const formErrors = ref({});
const initialData = ref({});
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
    isLoading.value = true;
    try {
        const userInfo = await getUserProfile();
        initialData.value = {
            name: userInfo.name,
            email: userInfo.email,
        };
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

const validateFields = (formData) => {
    formErrors.value = {};
    if (!formData.name) {
        formErrors.value.name = 'Le nom est requis.';
    }
    if (!formData.email) {
        formErrors.value.email = 'L\'email est requis.';
    } else if (!validateEmail(formData.email)) {
        formErrors.value.email = 'Le format de l\'email est invalide.';
    }
    if (!formData.message) {
        formErrors.value.message = 'Le message est requis.';
    }
    return Object.keys(formErrors.value).length === 0;
};

const handleSubmit = async (formData) => {
    if (validateFields(formData)) {
        isLoading.value = true;
        try {
            await sendContactMessage(formData);
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