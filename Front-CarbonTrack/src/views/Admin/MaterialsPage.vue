<template>
    <div class="container mx-auto mt-10 p-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-indigo-600 mt-4">Materials</h1>
            <p v-if="state.loading" class="mt-4 text-gray-600">Loading...</p>
            <p v-if="state.errorMessage" class="mt-4 text-red-600">{{ state.errorMessage }}</p>
            <div v-else>
                <table class="table-auto w-full mt-6">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Supplier</th>
                            <th class="px-4 py-2">Carbon Footprint</th>
                            <th class="px-4 py-2">Unit</th>
                            <th class="px-4 py-2">Price Per Unit</th>
                            <th class="px-4 py-2">Category</th>
                            <th class="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="material in state.materials" :key="material.id">
                            <td class="border px-4 py-2">{{ material.id }}</td>
                            <td class="border px-4 py-2">
                                <input v-model="material.name" class="border px-2 py-1" />
                            </td>
                            <td class="border px-4 py-2">
                                <input v-model="material.supplier" class="border px-2 py-1" />
                            </td>
                            <td class="border px-4 py-2">
                                <input v-model="material.carbonFootprint" class="border px-2 py-1" />
                            </td>
                            <td class="border px-4 py-2">
                                <input v-model="material.unit" class="border px-2 py-1" />
                            </td>
                            <td class="border px-4 py-2">
                                <input v-model="material.pricePerUnit" class="border px-2 py-1" />
                            </td>
                            <td class="border px-4 py-2">
                                <select v-model="material.categoryId" class="border px-2 py-1">
                                    <option v-for="category in state.categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </td>
                            <td class="border px-4 py-2">
                                <button @click="saveMaterial(material)" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                                <button @click="deleteMaterials(material.id)" class="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMaterials, updateMaterial, deleteMaterial } from '../../services/materialsService.js';
import { getCategories } from '../../services/categoriesService.js';

const state = ref({
    materials: [],
    categories: [],
    loading: true,
    errorMessage: ''
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
        await updateMaterial(material.id, material);
        alert('Material updated successfully');
    } catch (error) {
        alert('Failed to update material');
    }
};

const deleteMaterials = async (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
        try {
            await deleteMaterial(id);
            state.value.materials = state.value.materials.filter(material => material.id !== id);
            alert('Material deleted successfully');
        } catch (error) {
            alert('Failed to delete material');
        }
    }
};
</script>