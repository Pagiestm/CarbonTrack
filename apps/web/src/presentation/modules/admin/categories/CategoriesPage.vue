<template>
  <div>
    <PageHeader
      eyebrow="Administration"
      title="Catégories"
      :subtitle="`${catalog.categories.length} catégories`"
    >
      <template #actions>
        <AppButton to="/categories/create" :icon="Plus">Ajouter</AppButton>
      </template>
    </PageHeader>

    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>

    <EmptyState
      v-if="!catalog.categories.length"
      :icon="Tags"
      title="Aucune catégorie"
      description="Les catégories servent à ranger les matériaux dans le sélecteur de projet."
    />

    <DataTable
      v-else
      :columns="colonnes"
      :rows="catalog.categories"
      :edit-link="(c) => `/categories/edit/${c.id}`"
      @delete="aSupprimer = $event"
    >
      <template #cellule-materiaux="{ ligne }">
        {{ compte(ligne.id) }}
      </template>
    </DataTable>

    <ConfirmDialog
      v-if="aSupprimer"
      :title="`Supprimer « ${aSupprimer.name} » ?`"
      description="La suppression échouera si des matériaux y sont encore rattachés."
      :loading="suppression"
      @cancel="aSupprimer = null"
      @confirm="supprimer"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Plus, Tags } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import DataTable from '@/presentation/modules/admin/components/DataTable.vue';

const catalog = useCatalogStore();
const erreur = ref('');
const aSupprimer = ref(null);
const suppression = ref(false);

const colonnes = [
  { cle: 'name', libelle: 'Nom' },
  { cle: 'materiaux', libelle: 'Matériaux', alignement: 'droite' },
];

const compte = (categorieId) =>
  catalog.materiaux.filter((m) => m.categoryId === categorieId).length;

const supprimer = async () => {
  suppression.value = true;
  try {
    await useCases.catalog.deleteCategory.execute(aSupprimer.value.id);
    await catalog.charger();
    aSupprimer.value = null;
  } catch (e) {
    erreur.value = e.message;
    aSupprimer.value = null;
  } finally {
    suppression.value = false;
  }
};

onMounted(catalog.charger);
</script>
