<template>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead class="bg-gray-800 text-white">
                <tr>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Supplier</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Carbon Footprint</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Unit</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Price Per Unit</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <MaterialsRow v-for="material in materials" :key="material.id" :material="material" :categories="categories"
                    @updated="updateMaterial" @deleted="deleteMaterial" />
            </tbody>
        </table>
    </div>
</template>

<script setup>
import MaterialsRow from './MaterialsRow.vue';

const props = defineProps({
    materials: Array,
    categories: Array
});

const emit = defineEmits(['update', 'delete']);

const updateMaterial = (material) => {
    emit('update', material);
};

const deleteMaterial = (id) => {
    emit('delete', id);
};
</script>