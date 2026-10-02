<template>
  <div>
    <PageHeader
      eyebrow="Administration"
      title="Matériaux"
      :subtitle="`${catalog.materiaux.length} matériaux au catalogue`"
    >
      <template #actions>
        <AppButton to="/materials/create" :icon="Plus">Ajouter</AppButton>
      </template>
    </PageHeader>

    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>

    <div class="mb-6 max-w-sm">
      <AppField
        id="recherche"
        v-model="recherche"
        label="Rechercher"
        :icon="Search"
        placeholder="Nom ou fournisseur…"
        :required="false"
      />
    </div>

    <EmptyState
      v-if="!filtres.length"
      :icon="Package"
      title="Aucun matériau"
      description="Ajoutez un matériau pour qu'il soit proposé dans les projets."
    />

    <DataTable
      v-else
      :columns="colonnes"
      :rows="filtres"
      :edit-link="(m) => `/materials/edit/${m.id}`"
      @delete="aSupprimer = $event"
    >
      <template #cellule-categorie="{ ligne }">
        <span class="rounded-full bg-surface-overlay px-2 py-0.5 text-xs text-ink-muted">
          {{ ligne.category?.name ?? '—' }}
        </span>
      </template>
      <template #cellule-empreinte="{ ligne }">
        {{ ligne.carbonFootprint.toLocaleString('fr-FR') }} kg/{{ ligne.unit }}
      </template>
      <template #cellule-prix="{ ligne }">
        {{ ligne.pricePerUnit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
      </template>
    </DataTable>

    <ConfirmDialog
      v-if="aSupprimer"
      :title="`Supprimer « ${aSupprimer.name} » ?`"
      description="Les projets qui l'utilisent ne pourront plus le référencer."
      :loading="suppression"
      @cancel="aSupprimer = null"
      @confirm="supprimer"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Package, Plus, Search } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import DataTable from '@/presentation/modules/admin/components/DataTable.vue';

const catalog = useCatalogStore();
const recherche = ref('');
const erreur = ref('');
const aSupprimer = ref(null);
const suppression = ref(false);

const colonnes = [
  { cle: 'name', libelle: 'Nom' },
  { cle: 'categorie', libelle: 'Catégorie' },
  { cle: 'supplier', libelle: 'Fournisseur' },
  { cle: 'empreinte', libelle: 'Empreinte', alignement: 'droite' },
  { cle: 'prix', libelle: 'Prix', alignement: 'droite' },
];

const filtres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();
  if (!terme) return catalog.materiaux;
  return catalog.materiaux.filter(
    (m) => m.name.toLowerCase().includes(terme) || (m.supplier ?? '').toLowerCase().includes(terme),
  );
});

const supprimer = async () => {
  suppression.value = true;
  try {
    await useCases.catalog.deleteMaterial.execute(aSupprimer.value.id);
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
