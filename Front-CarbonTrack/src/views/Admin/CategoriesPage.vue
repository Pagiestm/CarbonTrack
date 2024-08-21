<template>
    <div class="container mx-auto mt-10">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-primary underline mt-4">Catégories</h1>
            <div class="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                <div class="flex-grow w-full sm:w-auto">
                    <SearchBar @search="handleSearch" />
                </div>
                <router-link to="/categories/create" class="w-full sm:w-auto">
                    <button
                        class="bg-customGreen text-white font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out sm:w-auto">
                        Ajouter une Catégorie
                    </button>
                </router-link>
            </div>
            <p v-if="state.loading" class="mt-4 text-gray-600">Chargement des données...</p>
            <p v-if="!state.loading && filteredCategories.length === 0" class="mt-4 text-gray-600">Aucune catégorie disponible.</p>
            <p v-if="state.errorMessage" class="mt-4 text-red-600">{{ state.errorMessage }}</p>
            <div v-if="!state.loading && filteredCategories.length > 0" class="mt-6">
                <CategoriesTable :categories="paginatedCategories" @update="saveCategory" @delete="deleteCategory" />
                <Pagination :totalItems="filteredCategories.length" :itemsPerPage="itemsPerPage" @pageChange="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCategories, createCategory, updateCategory, deleteCategory as apiDeleteCategory } from '../../services/categoriesService.js';
import CategoriesTable from '../../components/Admin/Categories/CategoriesTable.vue';
import SearchBar from '../../components/SearchBar.vue';
import Pagination from '../../components/Pagination.vue';

const state = ref({
    categories: [],
    loading: true,
    errorMessage: ''
});

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const filteredCategories = ref([]);

const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    filteredCategories.value = state.value.categories.filter(category =>
        category.name.toLowerCase().includes(lowerCaseQuery)
    );
    currentPage.value = 1;
};

const handlePageChange = (page) => {
    currentPage.value = page;
};

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCategories.value.slice(start, end);
});

onMounted(async () => {
    try {
        state.value.categories = await getCategories();
        filteredCategories.value = state.value.categories;
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue, veuillez réessayer';
    } finally {
        state.value.loading = false;
    }
});

const saveCategory = async (category) => {
    try {
        await updateCategory(category.id, category.name);
        state.value.categories = await getCategories();
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue lors de la mise à jour de la catégorie';
    }
};

const deleteCategory = async (id) => {
    try {
        await apiDeleteCategory(id);
        state.value.categories = await getCategories();
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue lors de la suppression de la catégorie';
    }
};
</script>