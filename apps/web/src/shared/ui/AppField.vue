<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium text-ink">
      {{ label }}
      <span v-if="!required" class="font-normal text-ink-subtle">(facultatif)</span>
    </label>

    <component
      :is="multiline ? 'textarea' : 'input'"
      :id="id"
      :type="multiline ? undefined : type"
      :rows="multiline ? rows : undefined"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="Boolean(error) || undefined"
      :aria-describedby="error ? `${id}-erreur` : hint ? `${id}-aide` : undefined"
      :class="[
        'w-full rounded-lg border bg-surface-raised px-3 py-2.5 text-sm text-ink transition-colors',
        'placeholder:text-ink-subtle focus:border-accent focus:outline-none',
        error ? 'border-danger' : 'border-line hover:border-line-strong',
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <p v-if="error" :id="`${id}-erreur`" class="mt-1.5 text-sm text-danger">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-aide`" class="mt-1.5 text-sm text-ink-subtle">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: undefined },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: true },
  multiline: { type: Boolean, default: false },
  rows: { type: Number, default: 5 },
});

defineEmits(['update:modelValue']);
</script>
