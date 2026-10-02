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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCases } from '@/container.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import ProjectForm from '@/presentation/modules/projects/components/ProjectForm.vue';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const projet = ref(null);
const erreur = ref('');
const chargement = ref(false);

const enregistrer = async (donnees) => {
  erreur.value = '';
  chargement.value = true;
  try {
    await useCases.projects.updateProject.execute(id, donnees);
    router.push(`/projects/${id}`);
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  try {
    projet.value = await useCases.projects.getProject.execute(id);
  } catch (e) {
    erreur.value = e.message;
  }
});
</script>
