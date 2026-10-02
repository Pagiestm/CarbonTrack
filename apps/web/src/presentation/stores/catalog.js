import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCases } from '@/container.js';

export const useCatalogStore = defineStore('catalog', () => {
  const materiaux = ref([]);
  const categories = ref([]);
  const chargement = ref(false);
  const erreur = ref('');

  const materiauxParId = computed(() => new Map(materiaux.value.map((m) => [m.id, m])));

  const charger = async ({ force = false } = {}) => {
    if (materiaux.value.length && !force) return;
    chargement.value = true;
    erreur.value = '';
    try {
      const [pageMateriaux, listeCategories] = await Promise.all([
        useCases.catalog.listAllMaterials.execute(),
        useCases.catalog.listCategories.execute(),
      ]);
      categories.value = listeCategories;

      const parId = new Map(listeCategories.map((c) => [c.id, c]));
      for (const materiau of pageMateriaux.items) {
        materiau.category ??= parId.get(materiau.categoryId) ?? null;
      }
      materiaux.value = pageMateriaux.items;
    } catch (e) {
      erreur.value = e.message;
    } finally {
      chargement.value = false;
    }
  };

  return { materiaux, categories, materiauxParId, chargement, erreur, charger };
});
