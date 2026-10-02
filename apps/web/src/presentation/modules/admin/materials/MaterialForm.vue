<template>
  <div class="mx-auto max-w-2xl">
    <PageHeader eyebrow="Administration" :title="title" />

    <AppCard>
      <form class="space-y-5" @submit.prevent="enregistrer">
        <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

        <AppField id="name" v-model="formulaire.name" label="Nom" placeholder="Béton C25/30" />

        <div class="grid gap-5 sm:grid-cols-2">
          <AppField id="categoryId" v-model="formulaire.categoryId" as="select" label="Catégorie">
            <option value="">Choisir…</option>
            <option v-for="c in catalog.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </AppField>

          <AppField
            id="supplier"
            v-model="formulaire.supplier"
            label="Fournisseur"
            placeholder="Nom du fournisseur"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-3">
          <AppField id="unit" v-model="formulaire.unit" label="Unité" placeholder="m³, kg, m²…" />
          <AppField
            id="carbonFootprint"
            v-model="formulaire.carbonFootprint"
            type="number"
            min="0"
            step="0.01"
            label="Empreinte"
            hint="kg eq. CO₂ par unité"
          />
          <AppField
            id="pricePerUnit"
            v-model="formulaire.pricePerUnit"
            type="number"
            min="0"
            step="0.01"
            label="Prix"
            hint="€ par unité"
          />
        </div>

        <div class="flex justify-end gap-3">
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
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const props = defineProps({
  title: { type: String, required: true },
  submitLabel: { type: String, required: true },
  mode: { type: String, default: 'create' }, // create | edit
});

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();

const formulaire = reactive({
  name: '',
  categoryId: '',
  supplier: '',
  unit: '',
  carbonFootprint: '',
  pricePerUnit: '',
});
const erreur = ref('');
const chargement = ref(false);

const charge = () => ({
  name: formulaire.name,
  supplier: formulaire.supplier,
  unit: formulaire.unit,
  categoryId: Number(formulaire.categoryId),
  carbonFootprint: Number(formulaire.carbonFootprint),
  pricePerUnit: Number(formulaire.pricePerUnit),
});

const enregistrer = async () => {
  erreur.value = '';
  chargement.value = true;
  try {
    if (props.mode === 'edit') {
      await useCases.catalog.updateMaterial.execute(Number(route.params.id), charge());
    } else {
      await useCases.catalog.createMaterial.execute(charge());
    }
    await catalog.charger();
    router.push('/admin/materials');
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  if (!catalog.categories.length) await catalog.charger();
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
    erreur.value = e.message;
  }
});
</script>
