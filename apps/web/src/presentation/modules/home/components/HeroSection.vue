<template>
  <section class="relative overflow-hidden border-b border-line">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true" :style="trame" />

    <div
      class="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:py-24"
    >
      <div>
        <p
          class="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-medium text-ink-muted"
        >
          <span class="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          56 matériaux référencés · base carbone ADEME
        </p>

        <h1
          class="mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-balance text-ink sm:text-5xl"
        >
          Un chantier, c'est d'abord <span class="text-accent">des tonnes de CO₂</span>
        </h1>

        <p class="mt-6 max-w-lg text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
          Avant la première livraison, l'empreinte d'un bâtiment est déjà écrite dans le choix de
          ses matériaux. CarbonTrack la chiffre, poste par poste, pendant que vous composez.
        </p>

        <div class="mt-7 flex flex-wrap gap-2">
          <EquationLine quantite="18 m³ de béton" facteur="245,5 kg/m³" resultat="4,42 t" />
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <AppButton
            :to="session.estConnecte ? '/projects/create' : '/register'"
            size="lg"
            class="w-full sm:w-auto"
          >
            {{ session.estConnecte ? 'Créer un projet' : 'Commencer gratuitement' }}
          </AppButton>
          <AppButton to="/contact" variant="secondary" size="lg" class="w-full sm:w-auto">
            Nous contacter
          </AppButton>
        </div>

        <p class="mt-5 text-xs text-ink-subtle">Sans carte bancaire · Vos projets restent privés</p>
      </div>

      <div class="rounded-card border border-line bg-surface-raised p-5 sm:p-7">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs text-ink-subtle">Extension ossature bois · 40 m²</p>
            <p class="mt-1 text-3xl font-bold tabular-nums text-ink">12,4 t</p>
            <p class="text-xs text-ink-subtle">équivalent CO₂ · 310 kg/m²</p>
          </div>
          <FootprintBadge :footprint="apercu" />
        </div>

        <div class="mt-5 border-t border-line pt-5">
          <BuildingSection />
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { Footprint } from '@/domain/entities/Footprint.js';
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import EquationLine from '@/presentation/components/ui/EquationLine.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import BuildingSection from '@/presentation/modules/home/components/BuildingSection.vue';

const session = useSessionStore();
const apercu = new Footprint(12_400);

const trame = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-line) 1px, transparent 0)',
  backgroundSize: '32px 32px',
  maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000 35%, transparent 100%)',
};
</script>

