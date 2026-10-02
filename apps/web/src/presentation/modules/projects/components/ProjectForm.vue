<template>
  <form class="space-y-6" @submit.prevent="$emit('submit', { ...formulaire })">
    <AppAlert v-if="error">{{ error }}</AppAlert>

    <AppCard title="Le projet">
      <div class="space-y-5">
        <AppField
          id="name"
          v-model="formulaire.name"
          label="Nom du projet"
          :icon="FolderKanban"
          placeholder="Extension ossature bois"
        />
        <AppField
          id="description"
          v-model="formulaire.description"
          label="Description"
          multiline
          :rows="3"
          :required="false"
          placeholder="Quelques mots sur le chantier…"
        />
      </div>
    </AppCard>

    <AppCard title="Matériaux" subtitle="Choisissez les matériaux et leurs quantités.">
      <template #actions>
        <FootprintBadge :footprint="estimation" />
      </template>

      <p v-if="catalog.chargement" class="text-sm text-ink-muted">Chargement du catalogue…</p>
      <MaterialPicker v-else v-model="formulaire.materials" :materials="catalog.materiaux" />
    </AppCard>

    <div class="flex justify-end gap-3">
      <AppButton to="/projects" variant="secondary">Annuler</AppButton>
      <AppButton type="submit" :loading="loading">{{ submitLabel }}</AppButton>
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { FolderKanban } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import MaterialPicker from '@/presentation/modules/projects/components/MaterialPicker.vue';

const props = defineProps({
  initial: { type: Object, default: null },
  submitLabel: { type: String, default: 'Enregistrer' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

defineEmits(['submit']);

const catalog = useCatalogStore();

const formulaire = reactive({
  name: '',
  description: '',
  materials: [{ materialId: '', quantity: '' }],
});

// Le total se recalcule pendant la saisie, par le cas d'usage : l'API reste la
// source de vérité au moment de l'enregistrement.
const estimation = computed(() =>
  useCases.projects.estimateFootprint.execute(formulaire.materials, catalog.materiauxParId),
);

watch(
  () => props.initial,
  (projet) => {
    if (!projet) return;
    formulaire.name = projet.name;
    formulaire.description = projet.description ?? '';
    formulaire.materials = projet.lines.length
      ? projet.lines.map((l) => ({ materialId: l.materialId, quantity: l.quantity }))
      : [{ materialId: '', quantity: '' }];
  },
  { immediate: true },
);

onMounted(() => {
  if (!catalog.materiaux.length) catalog.charger();
});
</script>
