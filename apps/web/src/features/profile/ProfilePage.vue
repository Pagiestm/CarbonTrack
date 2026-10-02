<template>
  <NavBar />
  <section class="w-full py-24 lg:py-32 bg-surface flex justify-center items-center min-h-screen">
    <div
      class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 justify-center items-center"
    >
      <div v-if="loading" class="text-center text-ink">Chargement des données...</div>
      <div v-else class="space-y-4 text-center lg:text-left">
        <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-accent mb-8">
          Mon profil
        </h1>
        <div v-if="user" class="flex flex-col items-center lg:flex-row lg:items-center gap-4">
          <span
            class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-overlay justify-center items-center"
          >
            <svg
              class="w-8 h-8 text-accent"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </span>
          <div class="grid gap-1 text-center lg:text-left">
            <div class="text-lg font-semibold text-ink">{{ user.name }}</div>
            <div class="text-ink">{{ user.email }}</div>
          </div>
        </div>
        <div v-if="user" class="grid gap-4 text-center lg:text-left">
          <div>
            <div class="text-lg font-medium text-ink underline mb-2 mt-4">
              Informations personnelles&nbsp;:
            </div>
            <div class="text-ink">
              Nom&nbsp;: {{ user.name }}<br />
              Email&nbsp;: {{ user.email }}<br />
              Inscrit le&nbsp;: {{ formatDate(user.createdAt) }}
            </div>
          </div>
        </div>
        <!-- Affiche le bouton de modification du profil uniquement si l'utilisateur n'est pas un utilisateur Google -->
        <div
          v-if="!isGoogleUser"
          class="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start"
        >
          <router-link
            to="/profile/edit"
            class="py-2 px-4 bg-accent text-accent-ink font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Modifier le profil
          </router-link>
        </div>
        <button
          @click="showDeleteModal = true"
          class="py-2 px-4 bg-danger text-surface font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Supprimer le compte
        </button>
        <DeleteConfirmationModal
          :show="showDeleteModal"
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer votre compte&nbsp;? Cette action est irréversible."
          @confirm="deleteAccount"
          @cancel="showDeleteModal = false"
        />
      </div>
      <!--
        Anciennement une photo hotlinkée sur Unsplash : dépendance à un service
        tiers, licence incertaine et chargement à la merci du réseau. Remplacée
        par un aplat construit avec les jetons du thème.
      -->
      <div
        class="mx-auto flex aspect-video items-center justify-center overflow-hidden rounded-card border border-line bg-gradient-to-br from-accent-soft to-surface-raised sm:w-full lg:order-last lg:aspect-square"
      >
        <svg
          class="size-24 text-accent/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0v.75h-15v-.75Z"
          />
        </svg>
      </div>
    </div>
  </section>
  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserProfile, deleteUserAccount } from '@/api/users';
import { clearSession } from '@/shared/auth/session';
import DeleteConfirmationModal from '@/shared/components/alerts/DeleteConfirmationModal.vue';
import NavBar from '@/shared/components/NavBar.vue';
import AppFooter from '@/shared/components/AppFooter.vue';

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
    clearSession();
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    alert('Une erreur est survenue lors de la suppression de votre compte.');
  } finally {
    showDeleteModal.value = false;
  }
};
</script>
