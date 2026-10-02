<template>
  <div class="overflow-x-auto rounded-card border border-line">
    <table class="w-full min-w-[40rem] text-sm">
      <thead class="bg-surface-overlay text-left">
        <tr>
          <th
            v-for="colonne in columns"
            :key="colonne.cle"
            scope="col"
            class="px-4 py-3 font-medium text-ink-muted"
            :class="colonne.alignement === 'droite' ? 'text-right' : ''"
          >
            {{ colonne.libelle }}
          </th>
          <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line bg-surface-raised">
        <tr
          v-for="ligne in rows"
          :key="ligne.id"
          class="transition-colors hover:bg-surface-overlay"
        >
          <td
            v-for="colonne in columns"
            :key="colonne.cle"
            class="px-4 py-3 text-ink"
            :class="colonne.alignement === 'droite' ? 'text-right tabular-nums' : ''"
          >
            <slot :name="`cellule-${colonne.cle}`" :ligne="ligne">
              {{ ligne[colonne.cle] }}
            </slot>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <AppButton
                variant="ghost"
                size="sm"
                :icon="Pencil"
                :to="editLink(ligne)"
                :aria-label="`Modifier ${ligne.name}`"
              />
              <AppButton
                variant="ghost"
                size="sm"
                :icon="Trash2"
                :aria-label="`Supprimer ${ligne.name}`"
                @click="$emit('delete', ligne)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Pencil, Trash2 } from 'lucide-vue-next';
import AppButton from '@/presentation/components/ui/AppButton.vue';

defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  editLink: { type: Function, required: true },
});

defineEmits(['delete']);
</script>
