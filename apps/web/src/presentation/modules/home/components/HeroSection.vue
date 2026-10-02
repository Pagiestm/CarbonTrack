<template>
  <section class="halo relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:pt-28">
    <div class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
      <div>
        <p
          class="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-xs text-ink-muted"
        >
          <span class="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Base de données matériaux et calcul instantané
        </p>

        <h1 class="mt-6 font-display text-4xl leading-[1.05] font-bold text-ink sm:text-6xl">
          Chaque matériau<br />
          a un <span class="text-accent">coût carbone</span>.
        </h1>

        <p class="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
          CarbonTrack chiffre l'empreinte des matériaux de vos projets de construction, poste par
          poste, et vous montre où se joue vraiment la réduction.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <AppButton :to="session.estConnecte ? '/projects/create' : '/register'" size="lg">
            {{ session.estConnecte ? 'Créer un projet' : 'Commencer gratuitement' }}
          </AppButton>
          <AppButton to="/contact" variant="secondary" size="lg">Nous contacter</AppButton>
        </div>
      </div>

      <!-- Aperçu construit en HTML plutôt qu'une capture : il reste net à
           toute taille, suit le thème, et ne pèse rien. -->
      <div class="rounded-card border border-line bg-surface-raised p-5 shadow-2xl shadow-black/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-ink-subtle">Extension ossature bois</p>
            <p class="font-display text-2xl font-bold text-ink">12,4 t eq. CO₂</p>
          </div>
          <FootprintBadge :footprint="apercu" />
        </div>

        <ul class="mt-6 space-y-3.5">
          <li v-for="poste in postes" :key="poste.nom">
            <div class="mb-1.5 flex justify-between text-sm">
              <span class="text-ink">{{ poste.nom }}</span>
              <span class="text-ink-muted">{{ poste.part }}&nbsp;%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
              <div
                class="h-full rounded-full"
                :style="{ width: `${poste.part}%`, backgroundColor: poste.couleur }"
              />
            </div>
          </li>
        </ul>

        <p class="mt-6 border-t border-line pt-4 text-xs text-ink-subtle">
          Soit environ {{ apercu.kilometresVoiture.toLocaleString('fr-FR') }} km en voiture
          thermique.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Footprint } from '@/domain/entities/Footprint.js';
import { useSessionStore } from '@/presentation/stores/session.js';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import { SERIE } from '@/presentation/components/ui/chart-theme.js';

const session = useSessionStore();
const apercu = new Footprint(12_400);

const postes = [
  { nom: 'Béton de fondation', part: 46, couleur: SERIE[4] },
  { nom: 'Isolation', part: 24, couleur: SERIE[3] },
  { nom: 'Ossature bois', part: 18, couleur: SERIE[0] },
  { nom: 'Menuiseries', part: 12, couleur: SERIE[2] },
];
</script>
