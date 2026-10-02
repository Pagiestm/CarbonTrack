<template>
  <form class="space-y-6" novalidate @submit.prevent="soumettre">
    <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

    <AppCard title="Le projet" subtitle="Le nom suffit pour commencer, le reste est facultatif.">
      <div class="space-y-5">
        <AppField
          id="name"
          v-model="formulaire.name"
          label="Nom du projet"
          :icon="FolderKanban"
          placeholder="Extension ossature bois"
          :error="erreurs.etat.parChamp.name"
        />

        <AppField
          id="description"
          v-model="formulaire.description"
          label="Description"
          multiline
          :rows="3"
          :required="false"
          placeholder="Quelques mots sur le chantier…"
          :error="erreurs.etat.parChamp.description"
        />

        <div class="grid gap-5 sm:grid-cols-2">
          <AppField
            id="kind"
            v-model="formulaire.kind"
            as="select"
            label="Type de chantier"
            :error="erreurs.etat.parChamp.kind"
          >
            <option v-for="(libelle, cle) in PROJECT_KINDS" :key="cle" :value="cle">
              {{ libelle }}
            </option>
          </AppField>

          <AppField
            id="status"
            v-model="formulaire.status"
            as="select"
            label="Statut"
            :error="erreurs.etat.parChamp.status"
          >
            <option v-for="(libelle, cle) in PROJECT_STATUSES" :key="cle" :value="cle">
              {{ libelle }}
            </option>
          </AppField>
        </div>

        <div class="grid gap-5 sm:grid-cols-3">
          <AppField
            id="location"
            v-model="formulaire.location"
            label="Lieu"
            :icon="MapPin"
            :required="false"
            placeholder="Ville du chantier"
            :error="erreurs.etat.parChamp.location"
          />
          <AppField
            id="surface"
            v-model="formulaire.surface"
            type="number"
            min="0"
            step="0.1"
            label="Surface"
            :required="false"
            hint="en m², pour l'empreinte au m²"
            :error="erreurs.etat.parChamp.surface"
          />
          <AppField
            id="startDate"
            v-model="formulaire.startDate"
            type="date"
            label="Début des travaux"
            :required="false"
            :error="erreurs.etat.parChamp.startDate"
          />
        </div>
      </div>
    </AppCard>

    <AppCard title="Matériaux" subtitle="Choisissez les matériaux et leurs quantités.">
      <template #actions>
        <FootprintBadge :footprint="estimation" />
      </template>

      <p v-if="catalog.chargement" class="text-sm text-ink-muted">Chargement du catalogue…</p>

      <MaterialPicker v-else v-model="formulaire.materials" :materials="catalog.materiaux" />
      <p v-if="erreurs.etat.parChamp.materials" class="mt-3 text-sm text-danger">
        {{ erreurs.etat.parChamp.materials }}
      </p>
    </AppCard>

    <div class="flex justify-end gap-3">
      <AppButton to="/projects" variant="secondary">Annuler</AppButton>

      <AppButton type="submit" :loading="loading">{{ submitLabel }}</AppButton>
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { FolderKanban, MapPin } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { PROJECT_KINDS, PROJECT_STATUSES } from '@/domain/entities/Project.js';
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
  error: { type: Object, default: null },
});

const emit = defineEmits(['submit']);

const erreurs = useFormErrors([
  'name',
  'description',
  'location',
  'surface',
  'startDate',
  'kind',
  'status',
  'materials',
]);

const valider = () => {
  erreurs.reinitialiser();

  if (!formulaire.name.trim()) erreurs.poser('name', 'Le nom du projet est requis');
  else if (formulaire.name.length > 100) erreurs.poser('name', '100 caractères au maximum');

  if (formulaire.surface !== '' && Number(formulaire.surface) <= 0) {
    erreurs.poser('surface', 'La surface doit être positive');
  }

  const lignes = formulaire.materials.filter((l) => l.materialId && Number(l.quantity) > 0);
  if (!lignes.length) {
    erreurs.poser('materials', 'Ajoutez au moins un matériau avec une quantité');
  } else {
    const ids = lignes.map((l) => Number(l.materialId));
    if (new Set(ids).size !== ids.length) {
      erreurs.poser('materials', 'Un matériau ne peut figurer qu’une fois dans un projet');
    }
  }

  return !erreurs.aDesErreurs();
};

const soumettre = () => {
  if (valider()) emit('submit', charge());
};

watch(
  () => props.error,
  (erreur) => {
    if (erreur) erreurs.depuisApi(erreur);
  },
);

const catalog = useCatalogStore();

const formulaire = reactive({
  name: '',
  description: '',
  location: '',
  surface: '',
  kind: 'NEUF',
  status: 'DRAFT',
  startDate: '',
  materials: [{ materialId: '', quantity: '' }],
});

const estimation = computed(() =>
  useCases.projects.estimateFootprint.execute(formulaire.materials, catalog.materiauxParId),
);

const charge = () => ({
  ...formulaire,
  location: formulaire.location || null,
  surface: formulaire.surface === '' ? null : Number(formulaire.surface),
  startDate: formulaire.startDate || null,
});

watch(
  () => props.initial,
  (projet) => {
    if (!projet) return;
    Object.assign(formulaire, {
      name: projet.name,
      description: projet.description ?? '',
      location: projet.location ?? '',
      surface: projet.surface ?? '',
      kind: projet.kind,
      status: projet.status,
      startDate: projet.startDate ? new Date(projet.startDate).toISOString().slice(0, 10) : '',
      materials: projet.lines.length
        ? projet.lines.map((l) => ({ materialId: l.materialId, quantity: l.quantity }))
        : [{ materialId: '', quantity: '' }],
    });
  },
  { immediate: true },
);

onMounted(catalog.charger);
</script>
