<template>
  <div class="mx-auto max-w-lg">
    <PageHeader eyebrow="Administration" :title="title" />

    <AppCard>
      <form class="space-y-5" novalidate @submit.prevent="enregistrer">
        <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

        <AppField
          id="name"
          v-model="nom"
          label="Nom de la catégorie"
          placeholder="Isolation"
          hint="Elle regroupe les matériaux dans le sélecteur de projet."
          :error="erreurs.etat.parChamp.name"
        />

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AppButton to="/admin/categories" variant="secondary">Annuler</AppButton>
          <AppButton type="submit" :loading="chargement">{{ submitLabel }}</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
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
const erreurs = useFormErrors(['name']);

const nom = ref('');
const chargement = ref(false);

const valider = () => {
  erreurs.reinitialiser();
  if (!nom.value.trim()) erreurs.poser('name', 'Le nom est requis');
  else if (nom.value.length > 100) erreurs.poser('name', '100 caractères au maximum');
  return !erreurs.aDesErreurs();
};

const enregistrer = async () => {
  if (!valider()) return;

  chargement.value = true;
  try {
    if (props.mode === 'edit') {
      await useCases.catalog.updateCategory.execute(Number(route.params.id), nom.value.trim());
      toasts.succes('Catégorie enregistrée.');
    } else {
      await useCases.catalog.createCategory.execute(nom.value.trim());
      toasts.succes('Catégorie ajoutée.');
    }
    await catalog.charger({ force: true });
    router.push('/admin/categories');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  if (props.mode !== 'edit') return;
  await catalog.charger();
  nom.value = catalog.categories.find((c) => c.id === Number(route.params.id))?.name ?? '';
});
</script>

