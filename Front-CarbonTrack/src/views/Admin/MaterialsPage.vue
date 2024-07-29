<template>
    <div class="container mx-auto">
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
                            <th class="px-4 py-2">Category ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="material in state.materials" :key="material.id">
                            <td class="border px-4 py-2">{{ material.id }}</td>
                            <td class="border px-4 py-2">{{ material.name }}</td>
                            <td class="border px-4 py-2">{{ material.supplier }}</td>
                            <td class="border px-4 py-2">{{ material.carbonFootprint }}</td>
                            <td class="border px-4 py-2">{{ material.unit }}</td>
                            <td class="border px-4 py-2">{{ material.pricePerUnit }}</td>
                            <td class="border px-4 py-2">{{ material.categoryId }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMaterials } from '../../services/materialsService.js';

const state = ref({
    materials: [],
    loading: true,
    errorMessage: ''
});

onMounted(async () => {
    try {
        state.value.materials = await getMaterials();
    } catch (error) {
        state.value.errorMessage = 'Une erreur est survenue, veuillez réessayer';
    } finally {
        state.value.loading = false;
    }
});
</script>