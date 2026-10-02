<template>
  <div>
    <div class="mb-1.5 flex items-baseline justify-between gap-2">
      <label :for="id" class="text-sm font-medium text-ink">{{ label }}</label>
      <span v-if="!required" class="text-xs text-ink-subtle">facultatif</span>
    </div>

    <div class="relative">
      <component
        :is="icon"
        v-if="icon && !multiline"
        class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true"
      />
      <component
        :is="baliseChamp"
        :id="id"
        v-bind="attributsChamp"
        :value="modelValue"
        :required="required"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="Boolean(error) || undefined"
        :aria-describedby="description"
        :class="[
          'w-full rounded-field border bg-surface px-3 py-2.5 text-sm text-ink transition-colors',
          'placeholder:text-ink-subtle focus:border-accent focus:outline-none',
          icon && !multiline ? 'pl-9' : '',
          error ? 'border-danger' : 'border-line hover:border-line-strong',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      >
        <slot />
      </component>
    </div>

    <p v-if="error" :id="`${id}-erreur`" class="mt-1.5 text-sm text-danger">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-aide`" class="mt-1.5 text-sm text-ink-subtle">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  as: { type: String, default: 'input' }, // input | textarea | select
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: undefined },
  icon: { type: [Object, Function], default: null },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: true },
  multiline: { type: Boolean, default: false },
  rows: { type: Number, default: 5 },
  step: { type: String, default: undefined },
  min: { type: [String, Number], default: undefined },
});

defineEmits(['update:modelValue']);

const baliseChamp = computed(() => (props.multiline ? 'textarea' : props.as));

const attributsChamp = computed(() => {
  if (props.multiline) return { rows: props.rows };
  if (props.as === 'select') return {};
  return { type: props.type, step: props.step, min: props.min };
});

const description = computed(() =>
  props.error ? `${props.id}-erreur` : props.hint ? `${props.id}-aide` : undefined,
);
</script>
