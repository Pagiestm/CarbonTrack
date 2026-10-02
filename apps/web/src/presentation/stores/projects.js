import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCases } from '@/container.js';
import { Footprint } from '@/domain/entities/Footprint.js';

export const useProjectsStore = defineStore('projects', () => {
  const projets = ref([]);
  const chargement = ref(false);
  const erreur = ref('');
  const recherche = ref('');

  const filtres = computed(() => {
    const terme = recherche.value.trim().toLowerCase();
    if (!terme) return projets.value;
    return projets.value.filter(
      (p) =>
        p.name.toLowerCase().includes(terme) || (p.description ?? '').toLowerCase().includes(terme),
    );
  });

  const empreinteTotale = computed(() =>
    Footprint.somme(projets.value.map((p) => p.totalFootprint)),
  );

  const charger = async () => {
    chargement.value = true;
    erreur.value = '';
    try {
      projets.value = await useCases.projects.listProjects.execute();
    } catch (e) {
      erreur.value = e.message;
    } finally {
      chargement.value = false;
    }
  };

  const supprimer = async (id) => {
    await useCases.projects.deleteProject.execute(id);
    projets.value = projets.value.filter((p) => p.id !== id);
  };

  return { projets, filtres, empreinteTotale, chargement, erreur, recherche, charger, supprimer };
});
