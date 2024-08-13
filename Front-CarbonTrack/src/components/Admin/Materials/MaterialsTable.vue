<template>
    <div class="flex flex-col">
        <!-- Card view for mobile -->
        <div class="block lg:hidden">
            <div v-for="material in materials" :key="material.id" class="bg-white shadow-md rounded-lg p-4 mb-4">
                <div class="flex flex-col">
                    <h2 class="text-lg font-bold">{{ material.name }}</h2>
                    <p class="text-gray-600">Fournisseur: {{ material.supplier }}</p>
                    <p class="text-gray-600">Empreinte carbone: {{ material.carbonFootprint }}</p>
                    <p class="text-gray-600">Unité: {{ material.unit }}</p>
                    <p class="text-gray-600">Prix par unité: {{ material.pricePerUnit }}</p>
                    <p class="text-gray-600">Catégorie: {{ getCategoryName(material.categoryId) }}</p>
                    <div class="flex justify-center space-x-2 mt-4">
                        <router-link :to="{ name: 'EditMaterialPage', params: { id: material.id } }">
                            <button class="text-blue-500">
                                <i class="fas fa-edit fa-lg"></i>
                            </button>
                        </router-link>
                        <button @click="openModal(material)" class="text-red-500">
                            <i class="fas fa-trash-alt fa-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table view for desktop -->
        <div v-if="materials.length > 0" class="hidden lg:flex flex-col flex-grow overflow-x-auto">
            <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-primary text-white">
                    <tr>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Nom</th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Fournisseur</th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Empreinte carbone
                        </th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Unité</th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Prix par unité
                        </th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Catégorie</th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="material in materials" :key="material.id">
                        <td class="border px-4 py-2 text-center">{{ material.name }}</td>
                        <td class="border px-4 py-2 text-center">{{ material.supplier }}</td>
                        <td class="border px-4 py-2 text-center">{{ material.carbonFootprint }}</td>
                        <td class="border px-4 py-2 text-center">{{ material.unit }}</td>
                        <td class="border px-4 py-2 text-center">{{ material.pricePerUnit }}</td>
                        <td class="border px-4 py-2 text-center">{{ getCategoryName(material.categoryId) }}</td>
                        <td class="border px-4 py-2 text-center">
                            <div class="flex justify-center space-x-2">
                                <router-link :to="{ name: 'EditMaterialPage', params: { id: material.id } }">
                                    <button class="text-blue-500 px-2 py-2">
                                        <i class="fas fa-edit fa-lg"></i>
                                    </button>
                                </router-link>
                                <button @click="openModal(material)" class="text-red-500 px-2 py-2 ml-2">
                                    <i class="fas fa-trash-alt fa-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="hidden lg:flex flex-col flex-grow justify-center items-center">
            <p class="text-gray-500">Aucun matériau disponible.</p>
        </div>

        <!-- Modal -->
        <DeleteConfirmationModal :show="showModal" :title="'Supprimer le matériel'"
            :message="'Êtes-vous sûr de vouloir supprimer le matériel ' + materialToDelete?.name + ' ? Cette action est irréversible.'"
            @confirm="confirmDelete" @cancel="closeModal" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import DeleteConfirmationModal from '../../Alert/DeleteConfirmationModal.vue';

const props = defineProps({
    materials: Array,
    categories: Array
});

const emit = defineEmits(['update', 'delete']);

const showModal = ref(false);
const materialToDelete = ref(null);

const openModal = (material) => {
    materialToDelete.value = material;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    materialToDelete.value = null;
};

const confirmDelete = () => {
    const index = props.materials.findIndex(material => material.id === materialToDelete.value.id);
    if (index !== -1) {
        props.materials.splice(index, 1);
    }
    emit('delete', materialToDelete.value.id);
    closeModal();
};

const getCategoryName = (categoryId) => {
    const category = props.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Non spécifiée';
};
</script>