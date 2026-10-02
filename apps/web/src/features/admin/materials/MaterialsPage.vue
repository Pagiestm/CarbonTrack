<template>
  <div class="container mx-auto mt-10">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-ink underline mt-4">Matériaux</h1>
      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <div class="grow w-full sm:w-auto">
          <SearchBar @search="handleSearch" />
        </div>
        <router-link to="/materials/create" class="w-full sm:w-auto">
          <button
            class="bg-accent text-accent-ink font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out sm:w-auto"
          >
            Ajouter un Matériau
          </button>
        </router-link>
      </div>
      <p v-if="state.loading" class="mt-4 text-ink-muted">Chargement des données...</p>
      <p v-if="!state.loading && filteredMaterials.length === 0" class="mt-4 text-ink-muted">
        Aucun matériau disponible.
      </p>
      <p v-if="state.errorMessage" class="mt-4 text-danger">{{ state.errorMessage }}</p>
      <div v-if="!state.loading && filteredMaterials.length > 0" class="mt-6">
        <MaterialsTable
          :materials="paginatedMaterials"
          :categories="state.categories"
          @delete="deleteMaterials"
        />
        <Pagination
          :totalItems="filteredMaterials.length"
          :itemsPerPage="itemsPerPage"
          @pageChange="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { deleteMaterial as apiDeleteMaterial, getCategories, getMaterials } from '@/api/catalog';
import MaterialsTable from '@/features/admin/materials/MaterialsTable.vue';
import SearchBar from '@/shared/components/SearchBar.vue';
import Pagination from '@/shared/components/PaginationBar.vue';

const state = ref({
  materials: [],
  categories: [],
  loading: true,
  errorMessage: '',
});

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const filteredMaterials = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return state.value.materials.filter(
    (material) =>
      material.name.toLowerCase().includes(query) ||
      material.supplier.toLowerCase().includes(query),
  );
});

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedMaterials = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMaterials.value.slice(start, end);
});

onMounted(async () => {
  try {
    state.value.materials = await getMaterials();
    state.value.categories = await getCategories();
  } catch {
    state.value.errorMessage = 'Une erreur est survenue, veuillez réessayer';
  } finally {
    state.value.loading = false;
  }
});

const deleteMaterials = async (id) => {
  state.value.errorMessage = '';
  try {
    await apiDeleteMaterial(id);
  } catch (error) {
    state.value.errorMessage = error.message;
  }
  state.value.materials = await getMaterials();
};
</script>
