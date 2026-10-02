<template>
  <div :class="height"><canvas ref="canevas" /></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  height: { type: String, default: 'h-72' },
});

const canevas = ref(null);
let graphique = null;

const dessiner = () => {
  graphique?.destroy();
  if (!canevas.value) return;
  graphique = new Chart(canevas.value, {
    type: props.type,
    data: props.data,
    options: props.options,
  });
};

onMounted(dessiner);
watch(() => [props.data, props.options], dessiner, { deep: true });
onBeforeUnmount(() => graphique?.destroy());
</script>
