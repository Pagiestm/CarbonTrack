<template>
  <div class="space-y-3" aria-hidden="true">
    <div
      v-for="n in lines"
      :key="n"
      class="animate-pulse rounded-field bg-surface-overlay"
      :class="height"
      :style="n === lines && lines > 1 ? { width: '70%' } : undefined"
    />
  </div>
</template>


<script setup>
defineProps({
  lines: { type: Number, default: 3 },
  height: { type: String, default: 'h-4' },
});
</script>

