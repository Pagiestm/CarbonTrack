<template>
  <RouterLink
    :to="`/projects/${project.id}`"
    class="group flex flex-col rounded-card border border-line bg-surface-raised p-5 transition-colors hover:border-accent/50"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate font-semibold text-ink transition-colors group-hover:text-accent">
          {{ project.name }}
        </h3>
        <p class="mt-0.5 text-xs text-ink-subtle">{{ project.kindLabel }}</p>
      </div>
      <FootprintBadge :footprint="project.totalFootprint" />
    </div>

    <p v-if="project.description" class="mt-3 line-clamp-2 text-sm text-ink-muted">
      {{ project.description }}
    </p>

    <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div v-if="project.surface">
        <dt class="text-ink-subtle">Surface</dt>
        <dd class="tabular-nums text-ink">{{ project.surface.toLocaleString('fr-FR') }} m²</dd>
      </div>
      <div v-if="project.footprintPerSquareMeter">
        <dt class="text-ink-subtle">Au m²</dt>
        <dd class="tabular-nums text-ink">
          {{ project.footprintPerSquareMeter.format() }}
        </dd>
      </div>
    </dl>

    <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 text-xs text-ink-subtle">
      <AppBadge :tone="tonStatut">{{ project.statusLabel }}</AppBadge>
      <span v-if="project.location" class="flex items-center gap-1.5">
        <MapPin class="size-3.5" aria-hidden="true" />
        {{ project.location }}
      </span>
      <span class="flex items-center gap-1.5">
        <Layers class="size-3.5" aria-hidden="true" />
        {{ project.lineCount }} matériau{{ project.lineCount > 1 ? 'x' : '' }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Layers, MapPin } from 'lucide-vue-next';
import { Project } from '@/domain/entities/Project.js';
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';

const props = defineProps({ project: { type: Project, required: true } });

const tonStatut = computed(
  () => ({ DRAFT: 'neutral', IN_PROGRESS: 'accent', DONE: 'success' })[props.project.status],
);
</script>
