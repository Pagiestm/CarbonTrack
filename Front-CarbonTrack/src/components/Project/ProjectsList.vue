<template>
  <section class="mb-12">
    <div class="flex flex-col md:flex-row justify-between items-center mt-6">
      <div class="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 md:mr-4">
        <SearchBar @search="handleSearch" />
      </div>
      <router-link to="/projects/create">
        <button
          class="py-2 px-4 bg-customGreen text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          Nouveau Projet
        </button>
      </router-link>
    </div>
    <div v-if="loading" class="text-center text-gray-500 mt-6">Chargement des projets...</div>
    <div v-else-if="paginatedProjects.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      <div v-for="project in paginatedProjects" :key="project.id"
        class="bg-primary rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-semibold text-light mb-2">{{ project.name }}</h3>
            <p class="text-gray-300 mb-4">{{ project.description }}</p>
            <router-link :to="{ name: 'ProjectDetailsPage', params: { id: project.id } }">
              <button class="bg-customGreen text-secondary py-2 px-4 rounded transition duration-300">
                Voir les détails
              </button>
            </router-link>
          </div>
          <button @click="confirmDelete(project)" class="text-red-500 hover:text-red-700 transition duration-300">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-6">Aucun projet trouvé.</div>
    <Pagination :totalItems="filteredProjects.length" :itemsPerPage="itemsPerPage" @pageChange="handlePageChange" />
    <DeleteConfirmationModal
      :show="showConfirmModal"
      title="Confirmer la suppression"
      :message="`Êtes-vous sûr de vouloir supprimer le projet : ${projectToDelete?.name} ?`"
      @confirm="deleteProjectById"
      @cancel="showConfirmModal = false"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SearchBar from '../SearchBar.vue';
import Pagination from '../Pagination.vue';
import DeleteConfirmationModal from '../Alert/DeleteConfirmationModal.vue';
import { getProjects, deleteProject } from '../../services/projectsService';

const projects = ref([]);
const filteredProjects = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const showConfirmModal = ref(false);
const projectToDelete = ref(null);

onMounted(async () => {
  try {
    const userProjects = await getProjects();
    projects.value = userProjects;
    filteredProjects.value = userProjects;
  } catch (error) {
    console.error('Échec du chargement des projets', error);
  } finally {
    loading.value = false;
  }
});

const confirmDelete = (project) => {
  projectToDelete.value = project;
  showConfirmModal.value = true;
};

const deleteProjectById = async () => {
  try {
    await deleteProject(projectToDelete.value.id);
    projects.value = projects.value.filter(project => project.id !== projectToDelete.value.id);
    filteredProjects.value = filteredProjects.value.filter(project => project.id !== projectToDelete.value.id);
  } catch (error) {
    console.error('Échec de la suppression du projet', error);
  } finally {
    showConfirmModal.value = false;
  }
};

const handleSearch = (query) => {
  const lowerCaseQuery = query.toLowerCase();
  filteredProjects.value = projects.value.filter(project =>
    project.name.toLowerCase().includes(lowerCaseQuery)
  );
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProjects.value.slice(start, end);
});
</script>
