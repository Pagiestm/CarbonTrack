<template>
  <div class="space-y-3">
    <div
      v-for="(ligne, index) in modelValue"
      :key="index"
      class="grid items-end gap-3 rounded-field border border-line bg-surface p-3 sm:grid-cols-[1fr_8rem_auto]"
    >
      <AppField
        :id="`materiau-${index}`"
        as="select"
        :model-value="ligne.materialId"
        label="Matériau"
        @update:model-value="modifier(index, 'materialId', $event)"
      >
        <option value="">Choisir un matériau…</option>
        <optgroup v-for="groupe in groupes" :key="groupe.nom" :label="groupe.nom">
          <option v-for="materiau in groupe.materiaux" :key="materiau.id" :value="materiau.id">
            {{ materiau.name }} — {{ materiau.carbonFootprint }} kg/{{ materiau.unit }}
          </option>
        </optgroup>
      </AppField>

      <AppField
        :id="`quantite-${index}`"
        type="number"
        min="0"
        step="0.01"
        :model-value="ligne.quantity"
        :label="`Quantité${uniteDe(ligne) ? ` (${uniteDe(ligne)})` : ''}`"
        placeholder="0"
        @update:model-value="modifier(index, 'quantity', $event)"
      />

      <AppButton
        variant="ghost"
        size="md"
        :icon="Trash2"
        :aria-label="`Retirer la ligne ${index + 1}`"
        :disabled="modelValue.length === 1"
        @click="retirer(index)"
      />
    </div>

    <AppButton variant="secondary" size="sm" :icon="Plus" @click="ajouter">
      Ajouter un matériau
    </AppButton>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const props = defineProps({
  modelValue: { type: Array, required: true },
  materials: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);

const groupes = computed(() => {
  const parCategorie = new Map();
  for (const materiau of props.materials) {
    const nom = materiau.category?.name ?? 'Sans catégorie';
    if (!parCategorie.has(nom)) parCategorie.set(nom, []);
    parCategorie.get(nom).push(materiau);
  }
  return [...parCategorie.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'fr'))
    .map(([nom, materiaux]) => ({ nom, materiaux }));
});

const uniteDe = (ligne) =>
  props.materials.find((m) => m.id === Number(ligne.materialId))?.unit ?? '';

const modifier = (index, champ, valeur) => {
  const lignes = props.modelValue.map((l, i) => (i === index ? { ...l, [champ]: valeur } : l));
  emit('update:modelValue', lignes);
};

const ajouter = () =>
  emit('update:modelValue', [...props.modelValue, { materialId: '', quantity: '' }]);

const retirer = (index) =>
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  );
</script>

