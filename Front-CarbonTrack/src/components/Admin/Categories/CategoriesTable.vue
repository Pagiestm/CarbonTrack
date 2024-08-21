<template>
    <div class="flex flex-col">
        <!-- Card view for mobile -->
        <div class="block lg:hidden">
            <div v-for="category in categories" :key="category.id" class="bg-white shadow-md rounded-lg p-4 mb-4">
                <div class="flex flex-col">
                    <h2 class="text-lg font-bold">{{ category.name }}</h2>
                    <div class="flex justify-center space-x-2 mt-4">
                        <router-link :to="{ name: 'EditCategoryPage', params: { id: category.id } }">
                            <button class="text-blue-500">
                                <i class="fas fa-edit fa-lg"></i>
                            </button>
                        </router-link>
                        <button @click="openModal(category)" class="text-red-500">
                            <i class="fas fa-trash-alt fa-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table view for desktop -->
        <div class="hidden lg:flex flex-col flex-grow overflow-x-auto">
            <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-primary text-white">
                    <tr>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Nom</th>
                        <th class="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="category in categories" :key="category.id">
                        <td class="border px-4 py-2 text-center">{{ category.name }}</td>
                        <td class="border px-4 py-2 text-center">
                            <div class="flex justify-center space-x-2">
                                <router-link :to="{ name: 'EditCategoryPage', params: { id: category.id } }">
                                    <button class="text-blue-500 px-2 py-2">
                                        <i class="fas fa-edit fa-lg"></i>
                                    </button>
                                </router-link>
                                <button @click="openModal(category)" class="text-red-500 px-2 py-2 ml-2">
                                    <i class="fas fa-trash-alt fa-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <DeleteConfirmationModal :show="showModal" :title="'Supprimer la catégorie'"
            :message="'Êtes-vous sûr de vouloir supprimer la catégorie ' + categoryToDelete?.name + ' ? Cette action est irréversible.'"
            @confirm="confirmDelete" @cancel="closeModal" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteConfirmationModal from '../../Alert/DeleteConfirmationModal.vue';

const props = defineProps({
    categories: Array
});

const emits = defineEmits(['update', 'delete']);

const showModal = ref(false);
const categoryToDelete = ref(null);

const openModal = (category) => {
    categoryToDelete.value = category;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    categoryToDelete.value = null;
};

const confirmDelete = () => {
    const index = props.categories.findIndex(category => category.id === categoryToDelete.value.id);
    if (index !== -1) {
        props.categories.splice(index, 1);
    }
    emits('delete', categoryToDelete.value.id);
    closeModal();
};

const editCategory = (category) => {
    emits('update', category);
};
</script>