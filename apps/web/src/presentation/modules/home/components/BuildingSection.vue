<template>
  <figure>
    <svg viewBox="0 0 520 290" class="h-auto w-full" role="img" :aria-label="description">
      <defs>
        <pattern
          id="sol-hachure"
          width="7"
          height="7"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-line-strong)" stroke-width="1.4" />
        </pattern>
      </defs>

      <rect x="0" y="250" width="520" height="34" fill="url(#sol-hachure)" opacity="0.5" />
      <line x1="0" y1="250" x2="520" y2="250" stroke="var(--color-line-strong)" stroke-width="2" />

      <g
        v-for="zone in zones"
        :key="zone.cle"
        :class="[
          'transition-opacity duration-150',
          active && active !== zone.cle ? 'opacity-20' : 'opacity-100',
        ]"
        @mouseenter="active = zone.cle"
        @mouseleave="active = null"
      >
        <path v-for="(forme, i) in zone.formes" :key="i" :d="forme" :fill="zone.couleur" />
      </g>

      <rect x="238" y="158" width="44" height="54" fill="var(--color-surface-raised)" />
      <line
        x1="260"
        y1="158"
        x2="260"
        y2="212"
        stroke="var(--color-line-strong)"
        stroke-width="1.5"
      />
      <line
        x1="238"
        y1="185"
        x2="282"
        y2="185"
        stroke="var(--color-line-strong)"
        stroke-width="1.5"
      />
    </svg>

    <ul class="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
      <li
        v-for="zone in zones"
        :key="`legende-${zone.cle}`"
        class="flex items-start gap-2"
        @mouseenter="active = zone.cle"
        @mouseleave="active = null"
      >
        <span
          class="mt-1 size-2.5 shrink-0 rounded-full"
          :style="{ backgroundColor: zone.couleur }"
          aria-hidden="true"
        />
        <span class="min-w-0">
          <span class="block text-xs leading-tight font-medium text-ink">{{ zone.nom }}</span>
          <span class="block text-xs tabular-nums text-ink-subtle">
            {{ zone.valeur }} · {{ zone.part }}&nbsp;%
          </span>
        </span>
      </li>
    </ul>

    <figcaption class="sr-only">{{ description }}</figcaption>
  </figure>
</template>


<script setup>
import { ref } from 'vue';
import { SERIE } from '@/presentation/components/ui/chart-theme.js';

const active = ref(null);

const zones = [
  {
    cle: 'fondation',
    nom: 'Fondation et dalle',
    valeur: '5,7 t',
    part: 46,
    couleur: SERIE[0],
    formes: ['M112 212 H408 V250 H112 Z'],
  },
  {
    cle: 'isolation',
    nom: 'Isolation',
    valeur: '3,0 t',
    part: 24,
    couleur: SERIE[1],
    formes: [
      'M140 126 H168 V212 H140 Z',
      'M352 126 H380 V212 H352 Z',
      'M168 126 L260 62 L352 126 V146 L260 82 L168 146 Z',
    ],
  },
  {
    cle: 'ossature',
    nom: 'Ossature bois',
    valeur: '2,2 t',
    part: 18,
    couleur: SERIE[2],
    formes: [
      'M164 106 L260 40 L356 106 V126 L260 60 L164 126 Z',
      'M112 126 H140 V212 H112 Z',
      'M380 126 H408 V212 H380 Z',
    ],
  },
  {
    cle: 'menuiseries',
    nom: 'Menuiseries',
    valeur: '1,5 t',
    part: 12,
    couleur: SERIE[3],
    formes: ['M228 148 H292 V222 H228 Z'],
  },
];

const description =
  'Coupe schématique d’une extension de 40 m² : la fondation et la dalle représentent 46 % de l’empreinte, l’isolation 24 %, l’ossature bois 18 %, les menuiseries 12 %.';
</script>

