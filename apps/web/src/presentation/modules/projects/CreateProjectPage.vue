<template>
  <AppShell>
    <PageHeader
      eyebrow="Nouveau projet"
      title="Composer un projet"
      subtitle="Ajoutez vos matériaux et leurs quantités, l'empreinte se calcule au fur et à mesure."
    />
    <ProjectForm
      submit-label="Créer le projet"
      :loading="chargement"
      :error="erreur"
      @submit="creer"
    />
  </AppShell>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCases } from '@/container.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import ProjectForm from '@/presentation/modules/projects/components/ProjectForm.vue';

const router = useRouter();
const toasts = useToasts();
const erreur = ref(null);
const chargement = ref(false);

const creer = async (donnees) => {
  erreur.value = null;
  chargement.value = true;
  try {
    const projet = await useCases.projects.createProject.execute(donnees);
    toasts.succes('Projet créé.');
    router.push(`/projects/${projet.id}`);
  } catch (e) {
    erreur.value = e;
  } finally {
    chargement.value = false;
  }
};
</script>

