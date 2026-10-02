<template>
  <AppShell>
    <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

    <div v-else-if="chargement" class="space-y-6">
      <div class="h-10 w-64 animate-pulse rounded-field bg-surface-raised" />
      <div class="h-64 animate-pulse rounded-card bg-surface-raised" />
    </div>

    <template v-else-if="projet">
      <PageHeader
        :eyebrow="`Projet n° ${projet.id}`"
        :title="projet.name"
        :subtitle="projet.description"
      >
        <template #actions>
          <AppButton :to="`/projects/edit/${projet.id}`" variant="secondary" :icon="Pencil">
            Modifier
          </AppButton>
          <AppButton variant="danger" :icon="Trash2" @click="confirmation = true">
            Supprimer
          </AppButton>
        </template>
      </PageHeader>

      <div class="mb-6 grid gap-4 sm:grid-cols-3">
        <AppCard padding="p-5">
          <p class="text-xs text-ink-subtle">Empreinte totale</p>
          <p class="mt-1 font-display text-2xl font-bold text-ink">
            {{ projet.totalFootprint.format() }}
          </p>
          <FootprintBadge :footprint="projet.totalFootprint" class="mt-3" />
        </AppCard>

        <AppCard padding="p-5">
          <p class="text-xs text-ink-subtle">Équivalent voiture</p>
          <p class="mt-1 font-display text-2xl font-bold text-ink">
            {{ projet.totalFootprint.kilometresVoiture.toLocaleString('fr-FR') }} km
          </p>
          <p class="mt-3 text-xs text-ink-subtle">Base carbone ADEME, voiture thermique moyenne</p>
        </AppCard>

        <AppCard padding="p-5">
          <p class="text-xs text-ink-subtle">Coût des matériaux</p>
          <p class="mt-1 font-display text-2xl font-bold text-ink">
            {{ projet.cost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
          </p>
          <p class="mt-3 text-xs text-ink-subtle">
            {{ projet.lines.length }} matériau{{ projet.lines.length > 1 ? 'x' : '' }}
          </p>
        </AppCard>
      </div>

      <AppCard title="Répartition par matériau" subtitle="Du poste le plus lourd au plus léger.">
        <FootprintBreakdown v-if="projet.lines.length" :project="projet" />
        <p v-else class="text-sm text-ink-muted">Ce projet ne contient aucun matériau.</p>
      </AppCard>

      <ConfirmDialog
        v-if="confirmation"
        :title="`Supprimer « ${projet.name} » ?`"
        description="Le projet et ses matériaux seront définitivement effacés."
        @cancel="confirmation = false"
        @confirm="supprimer"
      />
    </template>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Pencil, Trash2 } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import FootprintBreakdown from '@/presentation/modules/projects/components/FootprintBreakdown.vue';

const route = useRoute();
const router = useRouter();

const projet = ref(null);
const erreur = ref('');
const chargement = ref(true);
const confirmation = ref(false);

const supprimer = async () => {
  try {
    await useCases.projects.deleteProject.execute(Number(route.params.id));
    router.push('/projects');
  } catch (e) {
    erreur.value = e.message;
    confirmation.value = false;
  }
};

onMounted(async () => {
  try {
    projet.value = await useCases.projects.getProject.execute(Number(route.params.id));
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
});
</script>
