<template>
  <div class="max-w-md">
    <p class="text-xs font-medium tracking-wide text-accent uppercase">Dans le catalogue</p>

    <div class="mt-5 rounded-card border border-line bg-surface p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold text-ink">{{ materiau.nom }}</h2>
          <p class="mt-0.5 text-sm text-ink-subtle">{{ materiau.categorie }}</p>
        </div>
        <AppBadge tone="success">Sobre</AppBadge>
      </div>

      <dl class="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <div>
          <dt class="text-xs text-ink-subtle">Empreinte</dt>
          <dd class="mt-1 text-xl font-bold tabular-nums text-ink">
            {{ materiau.empreinte }}
            <span class="text-sm font-normal text-ink-muted">kg/{{ materiau.unite }}</span>
          </dd>
        </div>
        <div>
          <dt class="text-xs text-ink-subtle">Prix indicatif</dt>
          <dd class="mt-1 text-xl font-bold tabular-nums text-ink">
            {{ materiau.prix }}
            <span class="text-sm font-normal text-ink-muted">€/{{ materiau.unite }}</span>
          </dd>
        </div>
      </dl>

      <p class="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink-muted">
        {{ materiau.note }}
      </p>
    </div>

    <div class="mt-5">
      <p class="mb-3 text-xs text-ink-subtle">Comparé aux autres isolants du catalogue</p>
      <CarbonScale :materiaux="isolants" />
    </div>
  </div>
</template>

<script setup>
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import CarbonScale from '@/presentation/components/ui/CarbonScale.vue';

const materiau = {
  nom: 'Ouate de cellulose soufflée',
  categorie: 'Isolation',
  empreinte: '4,8',
  prix: '14',
  unite: 'm²',
  note: 'Papier recyclé, soufflé en combles. Sept fois moins émissive que le polyuréthane, à résistance thermique comparable.',
};

const isolants = [
  { nom: 'Ouate', kg: 4.8 },
  { nom: 'Chanvre', kg: 6.1 },
  { nom: 'Bois', kg: 12.4 },
  { nom: 'Roche', kg: 14.8 },
  { nom: 'Polystyrène', kg: 21.6 },
  { nom: 'Polyuréthane', kg: 34.2 },
];
</script>
