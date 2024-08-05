<template>
    <section class="w-full py-24 lg:py-32 overflow-hidden flex items-center justify-center">
        <div class="container max-w-xl bg-white p-8 shadow-md rounded-lg">
            <h2 class="text-3xl font-bold text-center text-indigo-600 mb-6">Modifier le Matériau</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <input v-model="localMaterial.name" placeholder="Nom" class="input-field" />
                </div>
                <div>
                    <input v-model="localMaterial.supplier" placeholder="Fournisseur" class="input-field" />
                </div>
                <div>
                    <input v-model="localMaterial.carbonFootprint" placeholder="Empreinte Carbone"
                        class="input-field" />
                </div>
                <div>
                    <input v-model="localMaterial.unit" placeholder="Unité" class="input-field" />
                </div>
                <div>
                    <input v-model="localMaterial.pricePerUnit" placeholder="Prix par Unité" class="input-field" />
                </div>
                <div>
                    <select v-model="localMaterial.categoryId" class="input-field">
                        <option value="">Choisir une Catégorie</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <button type="submit"
                    class="w-full bg-customGreen text-white font-semibold py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                    Enregistrer
                </button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { updateMaterial, getMaterialById } from '../../../services/materialsService.js';
import { getCategories } from '../../../services/categoriesService.js';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const materialId = route.params.id;

const localMaterial = ref({
    name: '',
    supplier: '',
    carbonFootprint: '',
    unit: '',
    pricePerUnit: '',
    categoryId: ''
});

const categories = ref([]);

onMounted(async () => {
    try {
        categories.value = await getCategories();
        const material = await getMaterialById(materialId);
        localMaterial.value = { ...material };
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});

const handleSubmit = async () => {
    try {
        await updateMaterial(materialId, localMaterial.value);
        alert('Matériau mis à jour avec succès');
        router.push('/');
    } catch (error) {
        alert('Échec de la mise à jour du matériau');
    }
};
</script>

<style scoped>
.input-field {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 8px;
    width: 100%;
    transition: border-color 0.3s ease;
}

.input-field:focus {
    outline: none;
    border-color: #68d391;
}
</style>