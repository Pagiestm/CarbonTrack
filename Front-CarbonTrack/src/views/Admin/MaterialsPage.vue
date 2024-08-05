<template>
    <div class="container mx-auto mt-10 p-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-indigo-600 mt-4">Materials</h1>
            <div class="flex justify-between items-center mt-4 space-x-4">
                <div class="flex-grow">
                    <SearchBar @search="handleSearch" />
                </div>
                <router-link to="/materials/create">
                    <button
                        class="bg-customGreen text-white font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                        Ajouter un Matériau
                    </button>
                </router-link>
            </div>
            <p v-if="state.loading" class="mt-4 text-gray-600">Loading...</p>
            <p v-if="state.errorMessage" class="mt-4 text-red-600">{{ state.errorMessage }}</p>
            <div v-else class="mt-6">
                <MaterialsTable :materials="filteredMaterials" :categories="state.categories" @update="saveMaterial"
                    @delete="deleteMaterials" />
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

const state = ref({
    materials: [],
    categories: [],
    loading: true,
    errorMessage: ''
});

const searchQuery = ref('');

const handleSearch = (query) => {
    searchQuery.value = query;
};

const filteredMaterials = computed(() => {
    if (!searchQuery.value) {
        return state.value.materials;
    }
    return state.value.materials.filter(material =>
        material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

onMounted(async () => {
    try {
        state.value.materials = await getMaterials();
        state.value.categories = await getCategories();
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