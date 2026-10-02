<template>
  <AdminList
    title="Projets"
    unite="projets sur la plateforme"
    :load="charger"
    search-placeholder="Nom, description ou lieu…"
    :empty-icon="FolderKanban"
    empty-title="Aucun projet"
  >
    <template #default="{ items }">
      <div class="overflow-x-auto rounded-card border border-line">
        <table class="w-full min-w-[48rem] text-sm">
          <thead class="bg-surface-overlay text-left">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Projet</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Type</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Lieu</th>
              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Surface</th>
              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Empreinte</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Statut</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Créé</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line bg-surface-raised">
            <tr v-for="projet in items" :key="projet.id" class="hover:bg-surface-overlay">
              <td class="px-4 py-3">
                <p class="font-medium text-ink">{{ projet.name }}</p>
                <p class="text-xs text-ink-subtle">
                  {{ projet.lineCount }} matériau{{ projet.lineCount > 1 ? 'x' : '' }}
                </p>
              </td>
              <td class="px-4 py-3 text-ink-muted">{{ projet.kindLabel }}</td>
              <td class="px-4 py-3 text-ink-muted">{{ projet.location ?? '—' }}</td>
              <td class="px-4 py-3 text-right tabular-nums text-ink-muted">
                {{ projet.surface ? `${projet.surface.toLocaleString('fr-FR')} m²` : '—' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end">
                  <FootprintBadge :footprint="projet.totalFootprint" />
                </div>
              </td>
              <td class="px-4 py-3">
                <AppBadge :tone="tonStatut(projet)">{{ projet.statusLabel }}</AppBadge>
              </td>
              <td class="px-4 py-3 text-ink-muted">{{ formatDate(projet.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

  </AdminList>

</template>


<script setup>
import { FolderKanban } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import AdminList from '@/presentation/modules/admin/components/AdminList.vue';

const charger = (options) => useCases.projects.listAllProjects.execute(options);

const tonStatut = (projet) =>
  ({ DRAFT: 'neutral', IN_PROGRESS: 'accent', DONE: 'success' })[projet.status];

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
</script>

