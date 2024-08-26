<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen flex items-center justify-center">
        <div class="container mx-auto px-4">
            <header class="mb-12 text-center">
                <h1 class="text-5xl font-bold text-white">Modifier le Profil</h1>
                <p class="text-lg text-gray-300 mt-4">
                    Modifiez les informations ci-dessous pour mettre à jour votre profil.
                </p>
            </header>
            <div v-if="loading" class="text-center text-white">Chargement des données...</div>
            <form v-else @submit.prevent="submitUpdateUserProfile" class="bg-primary p-8 rounded-lg shadow-lg mx-auto max-w-lg">
                <div class="mb-6">
                    <label for="name" class="block text-white mb-2">Nom</label>
                    <input v-model="user.name" type="text" id="name"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"/>
                    <FormError :message="errors.name" />
                </div>
                <div class="mb-6">
                    <label for="email" class="block text-white mb-2">Email</label>
                    <input v-model="user.email" type="email" id="email"
                        class="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"/>
                    <FormError :message="errors.email" />
                </div>
                <div class="flex justify-center">
                    <button type="submit"
                        class="py-3 px-6 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        Mettre à jour le profil
                    </button>
                </div>
                <FormError :message="errors.submit" />
            </form>
            <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage"
                @close="handleCloseSuccessMessage" />
            <ErrorMessage v-if="showErrorMessage" :show="showErrorMessage" :message="errorMessage"
                @close="handleCloseErrorMessage" />
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';
import FormError from '../../components/Alert/FormError.vue';
import SuccessMessage from '../../components/Alert/SuccessMessage.vue';
import ErrorMessage from '../../components/Alert/ErrorMessage.vue';

const user = ref({ name: '', email: '' });
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const showErrorMessage = ref(false);
const showSuccessMessage = ref(false);
const errors = ref({});
const router = useRouter();

onMounted(async () => {
    try {
        user.value = await getUserProfile();
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        errorMessage.value = 'Une erreur est survenue, veuillez réessayer';
        showErrorMessage.value = true;
    } finally {
        loading.value = false;
    }
});

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateForm = () => {
    errors.value = {};
    if (!user.value.name) errors.value.name = 'Le nom est requis.';
    if (!user.value.email) {
        errors.value.email = 'L\'email est requis.';
    } else if (!validateEmail(user.value.email)) {
        errors.value.email = 'Le format de l\'email est invalide.';
    }
    return Object.keys(errors.value).length === 0;
};

const submitUpdateUserProfile = async () => {
    if (!validateForm()) return;

    try {
        loading.value = true;

        // Filtre les champs nécessaires
        const userData = {
            name: user.value.name,
            email: user.value.email
        };

        await updateUserProfile(userData);
        errorMessage.value = '';
        successMessage.value = 'Profil mis à jour avec succès';
        showSuccessMessage.value = true;
    } catch (error) {
        console.error('Failed to update user profile:', error);
        errorMessage.value = 'Une erreur est survenue lors de la mise à jour, veuillez réessayer';
        showErrorMessage.value = true;
    } finally {
        loading.value = false;
    }
};

const handleCloseSuccessMessage = () => {
    showSuccessMessage.value = false;
    router.push('/profile');
};

const handleCloseErrorMessage = () => {
    showErrorMessage.value = false;
};

// Watchers to clear errors when fields are corrected
watch(() => user.value.name, () => {
    if (user.value.name) {
        errors.value.name = '';
    }
});

watch(() => user.value.email, () => {
    if (validateEmail(user.value.email)) {
        errors.value.email = '';
    }
});

</script>
