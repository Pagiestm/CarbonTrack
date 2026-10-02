<template>
  <AdminList
    ref="liste"
    title="Matériaux"
    unite="matériaux au catalogue"
    :load="charger"
    search-placeholder="Nom ou fournisseur…"
    :empty-icon="Package"
    empty-title="Aucun matériau"
    empty-description="Ajoutez un matériau pour qu'il soit proposé dans les projets."
  >
    <template #actions>
      <AppButton to="/materials/create" :icon="Plus">Ajouter</AppButton>
    </template>

    <template #default="{ items }">
      <div class="overflow-x-auto rounded-card border border-line">
        <table class="w-full min-w-[46rem] text-sm">
          <thead class="bg-surface-overlay text-left">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Nom</th>

              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Catégorie</th>

              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Fournisseur</th>

              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Empreinte</th>

              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Prix</th>

              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-line bg-surface-raised">
            <tr v-for="materiau in items" :key="materiau.id" class="hover:bg-surface-overlay">
              <td class="px-4 py-3 font-medium text-ink">{{ materiau.name }}</td>

              <td class="px-4 py-3">
                <AppBadge>{{ materiau.category?.name ?? '—' }}</AppBadge>
              </td>

              <td class="px-4 py-3 text-ink-muted">{{ materiau.supplier }}</td>

              <td class="px-4 py-3 text-right tabular-nums text-ink">
                {{ materiau.carbonFootprint.toLocaleString('fr-FR') }}
                <span class="text-ink-subtle">kg/{{ materiau.unit }}</span>
              </td>

              <td class="px-4 py-3 text-right tabular-nums text-ink-muted">
                {{
                  materiau.pricePerUnit.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })
                }}
              </td>

              <td class="px-4 py-3">
                <div class="flex justify-end gap-1">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    :icon="Pencil"
                    :to="`/materials/edit/${materiau.id}`"
                    :aria-label="`Modifier ${materiau.name}`"
                  />
                  <AppButton
                    variant="ghost"
                    size="sm"
                    :icon="Trash2"
                    :aria-label="`Supprimer ${materiau.name}`"
                    @click="aSupprimer = materiau"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminList>

  <ConfirmDialog
    v-if="aSupprimer"
    :title="`Supprimer « ${aSupprimer.name} » ?`"
    description="La suppression échouera si des projets l'utilisent encore."
    :loading="suppression"
    @cancel="aSupprimer = null"
    @confirm="supprimer"
  />
</template>

<script setup>
import { ref } from 'vue';
import { Package, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useCatalogStore } from '@/presentation/stores/catalog.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import AdminList from '@/presentation/modules/admin/components/AdminList.vue';

const catalog = useCatalogStore();
const toasts = useToasts();
const liste = ref(null);
const aSupprimer = ref(null);
const suppression = ref(false);

const charger = (options) => useCases.catalog.listMaterials.execute(options);

const supprimer = async () => {
  suppression.value = true;
  try {
    const nom = aSupprimer.value.name;
    await useCases.catalog.deleteMaterial.execute(aSupprimer.value.id);
    aSupprimer.value = null;
    toasts.succes(`« ${nom} » supprimé.`);
    await Promise.all([liste.value.rafraichir(), catalog.charger({ force: true })]);
  } catch (e) {
    toasts.erreur(e.message);
    aSupprimer.value = null;
  } finally {
    suppression.value = false;
  }
};
</script>
