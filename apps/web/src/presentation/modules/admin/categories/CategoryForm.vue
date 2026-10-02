<template>
  <div class="mx-auto max-w-lg">
    <PageHeader eyebrow="Administration" :title="title" />

    <AppCard>
      <form class="space-y-5" @submit.prevent="enregistrer">
        <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

        <AppField id="name" v-model="nom" label="Nom de la catégorie" placeholder="Isolation" />

        <div class="flex justify-end gap-3">
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

const nom = ref('');
const erreur = ref('');
const chargement = ref(false);

const enregistrer = async () => {
  erreur.value = '';
  chargement.value = true;
  try {
    if (props.mode === 'edit') {
      await useCases.catalog.updateCategory.execute(Number(route.params.id), nom.value);
    } else {
      await useCases.catalog.createCategory.execute(nom.value);
    }
    await catalog.charger();
    router.push('/admin/categories');
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  if (props.mode !== 'edit') return;
  if (!catalog.categories.length) await catalog.charger();
  nom.value = catalog.categories.find((c) => c.id === Number(route.params.id))?.name ?? '';
});
</script>
