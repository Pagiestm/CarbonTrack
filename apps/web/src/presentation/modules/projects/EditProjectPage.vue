<template>
  <AppShell>
    <div v-if="lecture" class="space-y-6">
      <AppSkeleton :lines="2" height="h-8" class="mb-8" />
      <AppCard><FormSkeleton :fields="4" :multiline="2" :actions="false" /></AppCard>
      <AppCard><AppSkeleton :lines="4" height="h-10" /></AppCard>
    </div>

    <template v-else>
      <PageHeader
        eyebrow="Modifier"
        :title="projet?.name ?? 'Projet'"
        subtitle="Ajustez les matériaux et les quantités."
      />
      <ProjectForm
        :initial="projet"
        submit-label="Enregistrer les modifications"
        :loading="chargement"
        :error="erreur"
        @submit="enregistrer"
      />
    </template>
  </AppShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCases } from '@/container.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import FormSkeleton from '@/presentation/components/ui/FormSkeleton.vue';
import ProjectForm from '@/presentation/modules/projects/components/ProjectForm.vue';

const route = useRoute();
const router = useRouter();
const toasts = useToasts();
const id = computed(() => Number(route.params.id));

const projet = ref(null);
const erreur = ref(null);
const chargement = ref(false);
const lecture = ref(true);

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
    lecture.value = true;
    try {
      projet.value = await useCases.projects.getProject.execute(identifiant);
    } catch (e) {
      erreur.value = e;
    } finally {
      lecture.value = false;
    }
  },
  { immediate: true },
);
</script>
