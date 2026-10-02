<template>
  <div class="mx-auto max-w-2xl">
    <PageHeader eyebrow="Administration" :title="title" />

    <AppCard>
      <form class="space-y-5" novalidate @submit.prevent="enregistrer">
        <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

        <AppField
          id="name"
          v-model="formulaire.name"
          label="Nom"
          placeholder="Béton C25/30"
          :error="erreurs.etat.parChamp.name"
        />

        <div class="grid gap-5 sm:grid-cols-2">
          <AppField
            id="categoryId"
            v-model="formulaire.categoryId"
            as="select"
            label="Catégorie"
            :error="erreurs.etat.parChamp.categoryId"
          >
            <option value="">Choisir…</option>
            <option v-for="c in catalog.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </AppField>

          <AppField
            id="supplier"
            v-model="formulaire.supplier"
            label="Fournisseur"
            placeholder="Nom du fournisseur"
            :error="erreurs.etat.parChamp.supplier"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-3">
          <AppField
            id="unit"
            v-model="formulaire.unit"
            label="Unité"
            placeholder="m³, kg, m²…"
            :error="erreurs.etat.parChamp.unit"
          />
          <AppField
            id="carbonFootprint"
            v-model="formulaire.carbonFootprint"
            type="number"
            min="0"
            step="0.01"
            label="Empreinte"
            hint="kg eq. CO₂ par unité"
            :error="erreurs.etat.parChamp.carbonFootprint"
          />
          <AppField
            id="pricePerUnit"
            v-model="formulaire.pricePerUnit"
            type="number"
            min="0"
            step="0.01"
            label="Prix"
            hint="€ par unité"
            :error="erreurs.etat.parChamp.pricePerUnit"
          />
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AppButton to="/admin/materials" variant="secondary">Annuler</AppButton>
          <AppButton type="submit" :loading="chargement">{{ submitLabel }}</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const props = defineProps({
  title: { type: String, required: true },
  submitLabel: { type: String, required: true },
  mode: { type: String, default: 'create' },
});

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();
const toasts = useToasts();
const erreurs = useFormErrors([
  'name',
  'categoryId',
  'supplier',
  'unit',
  'carbonFootprint',
  'pricePerUnit',
]);

const formulaire = reactive({
  name: '',
  categoryId: '',
  supplier: '',
  unit: '',
  carbonFootprint: '',
  pricePerUnit: '',
});
const chargement = ref(false);

const nombrePositif = (valeur) =>
  valeur !== '' && Number.isFinite(Number(valeur)) && Number(valeur) >= 0;

const valider = () => {
  erreurs.reinitialiser();

  if (!formulaire.name.trim()) erreurs.poser('name', 'Le nom est requis');
  else if (formulaire.name.length > 50) erreurs.poser('name', '50 caractères au maximum');

  if (!formulaire.categoryId) erreurs.poser('categoryId', 'Choisissez une catégorie');
  if (!formulaire.supplier.trim()) erreurs.poser('supplier', 'Le fournisseur est requis');
  if (!formulaire.unit.trim()) erreurs.poser('unit', "L'unité est requise");

  if (!nombrePositif(formulaire.carbonFootprint)) {
    erreurs.poser('carbonFootprint', 'Indiquez une empreinte positive');
  }
  if (!nombrePositif(formulaire.pricePerUnit)) {
    erreurs.poser('pricePerUnit', 'Indiquez un prix positif');
  }

  return !erreurs.aDesErreurs();
};

const charge = () => ({
  name: formulaire.name.trim(),
  supplier: formulaire.supplier.trim(),
  unit: formulaire.unit.trim(),
  categoryId: Number(formulaire.categoryId),
  carbonFootprint: Number(formulaire.carbonFootprint),
  pricePerUnit: Number(formulaire.pricePerUnit),
});

const enregistrer = async () => {
  if (!valider()) return;

  chargement.value = true;
  try {
    if (props.mode === 'edit') {
      await useCases.catalog.updateMaterial.execute(Number(route.params.id), charge());
      toasts.succes('Matériau enregistré.');
    } else {
      await useCases.catalog.createMaterial.execute(charge());
      toasts.succes('Matériau ajouté.');
    }
    await catalog.charger({ force: true });
    router.push('/admin/materials');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  await catalog.charger();
  if (props.mode !== 'edit') return;
  try {
    const materiau = await useCases.catalog.getMaterial.execute(Number(route.params.id));
    Object.assign(formulaire, {
      name: materiau.name,
      categoryId: materiau.categoryId,
      supplier: materiau.supplier,
      unit: materiau.unit,
      carbonFootprint: materiau.carbonFootprint,
      pricePerUnit: materiau.pricePerUnit,
    });
  } catch (e) {
    erreurs.depuisApi(e);
  }
});
</script>
