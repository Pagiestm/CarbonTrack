<template>
    <div class="container mx-auto mt-10">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-primary underline mt-4">Materials</h1>
            <div class="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                <div class="flex-grow w-full sm:w-auto">
                    <SearchBar @search="handleSearch" />
                </div>
                <router-link to="/materials/create" class="w-full sm:w-auto">
                    <button
                        class="bg-customGreen text-white font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out sm:w-auto">
                        Ajouter un Matériau
                    </button>
                </router-link>
            </div>
            <p v-if="state.loading" class="mt-4 text-gray-600">Loading...</p>
            <p v-if="!state.loading && filteredMaterials.length === 0" class="mt-4 text-gray-600">Aucun matériau disponible.</p>
            <p v-if="state.errorMessage" class="mt-4 text-red-600">{{ state.errorMessage }}</p>
            <div v-if="!state.loading && filteredMaterials.length > 0" class="mt-6">
                <MaterialsTable :materials="paginatedMaterials" :categories="state.categories" @update="saveMaterial"
                    @delete="deleteMaterials" />
                <Pagination :totalItems="filteredMaterials.length" :itemsPerPage="itemsPerPage" @pageChange="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getMaterials, updateMaterial, deleteMaterial as apiDeleteMaterial } from '../../services/materialsService.js';
import { getCategories } from '../../services/categoriesService.js';
import MaterialsTable from '../../components/Admin/Materials/MaterialsTable.vue';
import SearchBar from '../../components/SearchBar.vue';
import Pagination from '../../components/Pagination.vue';

const state = ref({
    materials: [],
    categories: [],
    loading: true,
    errorMessage: ''
});

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const filteredMaterials = ref([]);

const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    filteredMaterials.value = state.value.materials.filter(material =>
        material.name.toLowerCase().includes(lowerCaseQuery) ||
        material.supplier.toLowerCase().includes(lowerCaseQuery)
    );
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
        filteredMaterials.value = state.value.materials;
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue, veuillez réessayer';
    } finally {
        state.value.loading = false;
    }
});

const saveMaterial = async (material) => {
    try {
        await updateMaterial(material);
        state.value.materials = await getMaterials();
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue lors de la mise à jour du matériau';
    }
};

const deleteMaterials = async (id) => {
    try {
        await apiDeleteMaterial(id);
        state.value.materials = await getMaterials();
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue lors de la suppression du matériau';
    }
};
</script>