<template>
    <tr>
        <td class="border px-4 py-2">{{ material.id }}</td>
        <td class="border px-4 py-2">{{ material.name }}</td>
        <td class="border px-4 py-2">{{ material.supplier }}</td>
        <td class="border px-4 py-2">{{ material.carbonFootprint }}</td>
        <td class="border px-4 py-2">{{ material.unit }}</td>
        <td class="border px-4 py-2">{{ material.pricePerUnit }}</td>
        <td class="border px-4 py-2">
            <span>{{ getCategoryName(material.categoryId) }}</span>
        </td>
        <td class="border px-4 py-2">
            <router-link :to="{ name: 'EditMaterial', params: { id: material.id } }">
                <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    Modifier
                </button>
            </router-link>
            <button @click="remove" class="bg-red-500 text-white px-4 py-2 rounded ml-2">
                Supprimer
            </button>
        </td>
    </tr>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    material: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['updated', 'deleted']);

const remove = () => {
    emit('deleted', props.material.id);
};

const getCategoryName = (categoryId) => {
    const category = props.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Non spécifiée';
};
</script>