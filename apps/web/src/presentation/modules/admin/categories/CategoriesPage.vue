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

    <AppCard v-if="catalog.chargement" padding="p-4">
      <AppSkeleton :lines="6" height="h-6" />
    </AppCard>

    <EmptyState
      v-else-if="!catalog.categories.length"
      :icon="Tags"
      title="Aucune catégorie"
      description="Les catégories rangent les matériaux dans le sélecteur de projet."
    />

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AppCard v-for="categorie in categoriesTriees" :key="categorie.id" padding="p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate font-semibold text-ink">{{ categorie.name }}</h2>

            <p class="mt-1 text-sm text-ink-muted">
              {{ categorie.nombre }} matériau{{ categorie.nombre > 1 ? 'x' : '' }}
            </p>
          </div>

          <div class="flex shrink-0 gap-1">
            <AppButton
              variant="ghost"
              size="sm"
              :icon="Pencil"
              :to="`/categories/edit/${categorie.id}`"
              :aria-label="`Modifier ${categorie.name}`"
            />
            <AppButton
              variant="ghost"
              size="sm"
              :icon="Trash2"
              :aria-label="`Supprimer ${categorie.name}`"
              @click="aSupprimer = categorie"
            />
          </div>
        </div>
      </AppCard>
    </div>

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
import { computed, onMounted, ref } from 'vue';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';

const catalog = useCatalogStore();
const toasts = useToasts();
const aSupprimer = ref(null);
const suppression = ref(false);

const categoriesTriees = computed(() =>
  catalog.categories
    .map((categorie) => ({
      ...categorie,
      nombre: catalog.materiaux.filter((m) => m.categoryId === categorie.id).length,
    }))
    .sort((a, b) => b.nombre - a.nombre),
);

const supprimer = async () => {
  suppression.value = true;
  try {
    const nom = aSupprimer.value.name;
    await useCases.catalog.deleteCategory.execute(aSupprimer.value.id);
    aSupprimer.value = null;
    toasts.succes(`« ${nom} » supprimée.`);
    await catalog.charger({ force: true });
  } catch (e) {
    toasts.erreur(e.message);
    aSupprimer.value = null;
  } finally {
    suppression.value = false;
  }
};

onMounted(() => catalog.charger({ force: true }));
</script>
