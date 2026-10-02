import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCases } from '@/container.js';

/**
 * Catalogue des matériaux et catégories. Les pages projet s'en servent pour
 * composer une sélection ; l'administration pour les gérer.
 */
export const useCatalogStore = defineStore('catalog', () => {
  const materiaux = ref([]);
  const categories = ref([]);
  const chargement = ref(false);
  const erreur = ref('');

  const materiauxParId = computed(() => new Map(materiaux.value.map((m) => [m.id, m])));

  const charger = async () => {
    chargement.value = true;
    erreur.value = '';
    try {
      const [m, c] = await Promise.all([
        useCases.catalog.listMaterials.execute(),
        useCases.catalog.listCategories.execute(),
      ]);
      categories.value = c;

      // /materials ne renvoie que categoryId, pas la catégorie elle-même :
      // on recolle la référence ici, une fois, plutôt que dans chaque vue.
      const parId = new Map(c.map((categorie) => [categorie.id, categorie]));
      for (const materiau of m) {
        materiau.category ??= parId.get(materiau.categoryId) ?? null;
      }
      materiaux.value = m;
    } catch (e) {
      erreur.value = e.message;
    } finally {
      chargement.value = false;
    }
  };

  return { materiaux, categories, materiauxParId, chargement, erreur, charger };
});
