<template>
  <AppShell>
    <PageHeader
      eyebrow="Modifier"
      :title="projet?.name ?? 'Chargement…'"
      subtitle="Ajustez les matériaux et les quantités."
    />
    <ProjectForm
      :initial="projet"
      submit-label="Enregistrer les modifications"
      :loading="chargement"
      :error="erreur"
      @submit="enregistrer"
    />
  </AppShell>
</template>


<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCases } from '@/container.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import ProjectForm from '@/presentation/modules/projects/components/ProjectForm.vue';

const route = useRoute();
const router = useRouter();
const toasts = useToasts();
const id = computed(() => Number(route.params.id));

const projet = ref(null);
const erreur = ref(null);
const chargement = ref(false);

const enregistrer = async (donnees) => {
  erreur.value = null;
  chargement.value = true;
  try {
    await useCases.projects.updateProject.execute(id.value, donnees);
    toasts.succes('Projet enregistré.');
    router.push(`/projects/${id.value}`);
  } catch (e) {
    erreur.value = e;
  } finally {
    chargement.value = false;
  }
};

watch(
  id,
  async (identifiant) => {
    if (!identifiant) return;
    try {
      projet.value = await useCases.projects.getProject.execute(identifiant);
    } catch (e) {
      erreur.value = e;
    }
  },
  { immediate: true },
);
</script>

