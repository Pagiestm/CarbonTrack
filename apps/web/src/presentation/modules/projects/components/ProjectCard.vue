<template>
  <RouterLink
    :to="`/projects/${project.id}`"
    class="group block rounded-card border border-line bg-surface-raised p-5 transition-colors hover:border-accent/40"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-semibold text-ink transition-colors group-hover:text-accent">
        {{ project.name }}
      </h3>
      <FootprintBadge :footprint="project.totalFootprint" />
    </div>

    <p v-if="project.description" class="mt-2 line-clamp-2 text-sm text-ink-muted">
      {{ project.description }}
    </p>

    <div class="mt-5 flex items-center gap-4 text-xs text-ink-subtle">
      <span class="flex items-center gap-1.5">
        <Layers class="size-3.5" aria-hidden="true" />
        {{ project.lines.length }} matériau{{ project.lines.length > 1 ? 'x' : '' }}
      </span>
      <span v-if="project.createdAt" class="flex items-center gap-1.5">
        <Calendar class="size-3.5" aria-hidden="true" />
        {{ date }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Calendar, Layers } from 'lucide-vue-next';
import { Project } from '@/domain/entities/Project.js';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';

const props = defineProps({ project: { type: Project, required: true } });

const date = computed(() =>
  new Date(props.project.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
);
</script>
