<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary flex justify-center items-center min-h-screen">
        <div class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 justify-center items-center">
            <div v-if="loading" class="text-center text-light">Chargement des données...</div>
            <div v-else class="space-y-4 text-center lg:text-left">
                <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-customGreen mb-8">
                    Mon profil</h1>
                <div v-if="user" class="flex flex-col items-center lg:flex-row lg:items-center gap-4">
                    <span
                        class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary justify-center items-center">
                        <svg class="w-8 h-8 text-customGreen" fill="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </span>
                    <div class="grid gap-1 text-center lg:text-left">
                        <div class="text-lg font-semibold text-light">{{ user.name }}</div>
                        <div class="text-light">{{ user.email }}</div>
                    </div>
                </div>
                <div v-if="user" class="grid gap-4 text-center lg:text-left">
                    <div>
                        <div class="text-lg font-medium text-light underline mb-2 mt-4">Informations personnelles :
                        </div>
                        <div class="text-light">
                            Nom : {{ user.name }}<br>
                            Email : {{ user.email }}<br>
                            Inscrit le : {{ formatDate(user.createdAt) }}
                        </div>
                    </div>
                </div>
                <!-- Affiche le bouton de modification du profil uniquement si l'utilisateur n'est pas un utilisateur Google -->
                <div v-if="!isGoogleUser"
                    class="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <router-link to="/profile/edit"
                        class="py-2 px-4 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        Modifier le profil
                    </router-link>
                </div>
                <button @click="showDeleteModal = true"
                    class="py-2 px-4 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                    Supprimer le compte
                </button>
                <DeleteConfirmationModal :show="showDeleteModal" title="Confirmer la suppression"
                    message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
                    @confirm="deleteAccount" @cancel="showDeleteModal = false" />
            </div>
            <div
                class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square">
                <img src="https://images.unsplash.com/photo-1505235687559-28b5f54645b7?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    width="550" height="550" alt="Profile" class="w-full h-full object-cover" />
            </div>
        </div>
    </section>
    <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserProfile, deleteUserAccount } from '../../services/userService';
import DeleteConfirmationModal from '../../components/Alert/DeleteConfirmationModal.vue';
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';

const user = ref(null);
const loading = ref(true);
const isGoogleUser = ref(false);
const showDeleteModal = ref(false);
const router = useRouter();

onMounted(async () => {
    try {
        user.value = await getUserProfile();
        if (user.value && user.value.googleId) {
            isGoogleUser.value = true;
        }
    } catch (error) {
        console.error('Échec du chargement des données utilisateur', error);
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const deleteAccount = async () => {
    try {
        await deleteUserAccount();
        // Supprime le token après la suppression du compte
        localStorage.removeItem('authToken');
        router.push('/login');
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        alert('Une erreur est survenue lors de la suppression de votre compte.');
    } finally {
        showDeleteModal.value = false;
    }
};

</script>
