<template>
  <AppShell>
    <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

    <div v-else-if="chargement" class="space-y-6">
      <AppSkeleton :lines="2" height="h-8" />
      <div class="grid gap-4 sm:grid-cols-4">
        <AppCard v-for="n in 4" :key="n"><AppSkeleton :lines="2" /></AppCard>
      </div>
      <AppCard><AppSkeleton :lines="6" /></AppCard>
    </div>

    <template v-else-if="projet">
      <PageHeader :eyebrow="projet.kindLabel" :title="projet.name" :subtitle="projet.description">
        <template #actions>
          <AppButton variant="secondary" :icon="Copy" :loading="duplication" @click="dupliquer">
            Dupliquer
          </AppButton>
          <AppButton variant="secondary" :icon="Download" @click="exporter">CSV</AppButton>
          <AppButton :to="`/projects/edit/${projet.id}`" variant="secondary" :icon="Pencil">
            Modifier
          </AppButton>
          <AppButton variant="danger" :icon="Trash2" @click="confirmation = true">
            Supprimer
          </AppButton>
        </template>

      </PageHeader>


      <div class="mb-6 flex flex-wrap items-center gap-2">
        <AppBadge :tone="tonStatut">{{ projet.statusLabel }}</AppBadge>


        <AppBadge v-if="projet.location" :icon="MapPin">{{ projet.location }}</AppBadge>


        <AppBadge v-if="projet.surface" :icon="Ruler">
          {{ projet.surface.toLocaleString('fr-FR') }} m²
        </AppBadge>


        <AppBadge v-if="projet.startDate" :icon="CalendarDays">
          Démarré le {{ formatDate(projet.startDate) }}
        </AppBadge>


        <AppBadge :icon="Clock">Créé le {{ formatDate(projet.createdAt) }}</AppBadge>

      </div>


      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile :icon="Cloud" label="Empreinte totale" :value="projet.totalFootprint.format()">
          <FootprintBadge :footprint="projet.totalFootprint" />
        </StatTile>


        <StatTile
          :icon="Gauge"
          label="Empreinte au m²"
          :value="projet.footprintPerSquareMeter?.format() ?? '—'"
          :hint="projet.surface ? 'kg eq. CO₂ par m²' : 'renseignez la surface'"
        />

        <StatTile
          :icon="Car"
          label="Équivalent voiture"
          :value="`${projet.totalFootprint.kilometresVoiture.toLocaleString('fr-FR')} km`"
          hint="base carbone ADEME"
        />

        <StatTile
          :icon="Euro"
          label="Coût des matériaux"
          :value="euros(projet.cost)"
          :hint="projet.costPerSquareMeter ? `${euros(projet.costPerSquareMeter)} / m²` : ''"
        />
      </div>


      <div class="grid gap-6 lg:grid-cols-3">
        <AppCard
          class="lg:col-span-2"
          title="Répartition par matériau"
          subtitle="Du poste le plus lourd au plus léger."
        >
          <FootprintBreakdown v-if="projet.lines.length" :project="projet" />
          <p v-else class="text-sm text-ink-muted">Ce projet ne contient aucun matériau.</p>

        </AppCard>


        <AppCard title="Le poste dominant" subtitle="Là où la réduction compte le plus.">
          <template v-if="dominant">
            <p class="text-lg font-semibold text-ink">{{ dominant.ligne.material?.name }}</p>


            <p class="mt-1 text-sm text-ink-muted">
              {{ dominant.ligne.quantity.toLocaleString('fr-FR') }}
              {{ dominant.ligne.material?.unit }} · {{ Math.round(dominant.part) }} % de l'empreinte
            </p>
            <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-overlay">
              <div class="h-full rounded-full bg-accent" :style="{ width: `${dominant.part}%` }" />
            </div>
            <p class="mt-4 text-sm text-ink-muted">
              Diviser ce poste par deux ferait gagner
              <strong class="text-ink">{{ economie.format() }}</strong> eq. CO₂, soit
              {{ economie.kilometresVoiture.toLocaleString('fr-FR') }} km en voiture.
            </p>
          </template>
          <p v-else class="text-sm text-ink-muted">Ajoutez des matériaux pour voir le détail.</p>
        </AppCard>
      </div>

      <AppCard class="mt-6" title="Détail des lignes">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[36rem] text-sm">
            <thead class="border-b border-line text-left">
              <tr>
                <th scope="col" class="pb-2 font-medium text-ink-muted">Matériau</th>
                <th scope="col" class="pb-2 font-medium text-ink-muted">Catégorie</th>
                <th scope="col" class="pb-2 text-right font-medium text-ink-muted">Quantité</th>
                <th scope="col" class="pb-2 text-right font-medium text-ink-muted">Empreinte</th>
                <th scope="col" class="pb-2 text-right font-medium text-ink-muted">Coût</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line">
              <tr v-for="ligne in projet.lines" :key="ligne.materialId">
                <td class="py-2.5 text-ink">{{ ligne.material?.name ?? 'Matériau supprimé' }}</td>
                <td class="py-2.5 text-ink-muted">{{ ligne.material?.category?.name ?? '—' }}</td>
                <td class="py-2.5 text-right tabular-nums text-ink-muted">
                  {{ ligne.quantity.toLocaleString('fr-FR') }} {{ ligne.material?.unit }}
                </td>
                <td class="py-2.5 text-right tabular-nums text-ink">
                  {{ ligne.footprint.format() }}
                </td>
                <td class="py-2.5 text-right tabular-nums text-ink-muted">
                  {{ euros(ligne.cost) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>

      <ConfirmDialog
        v-if="confirmation"
        :title="`Supprimer « ${projet.name} » ?`"
        description="Le projet et ses matériaux seront définitivement effacés."
        :loading="suppression"
        @cancel="confirmation = false"
        @confirm="supprimer"
      />
    </template>
  </AppShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  CalendarDays,
  Car,
  Clock,
  Cloud,
  Copy,
  Download,
  Euro,
  Gauge,
  MapPin,
  Pencil,
  Ruler,
  Trash2,
} from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { Footprint } from '@/domain/entities/Footprint.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import { telechargerCsv, projetEnCsv } from '@/presentation/composables/useCsvExport.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import StatTile from '@/presentation/components/ui/StatTile.vue';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import FootprintBreakdown from '@/presentation/modules/projects/components/FootprintBreakdown.vue';

const route = useRoute();
const router = useRouter();
const toasts = useToasts();

const projet = ref(null);
const erreur = ref('');
const chargement = ref(true);
const confirmation = ref(false);
const suppression = ref(false);
const duplication = ref(false);

const euros = (valeur) =>
  valeur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const tonStatut = computed(
  () => ({ DRAFT: 'neutral', IN_PROGRESS: 'accent', DONE: 'success' })[projet.value.status],
);

const dominant = computed(() => projet.value?.repartition[0] ?? null);
const economie = computed(() => new Footprint((dominant.value?.ligne.footprint.kg ?? 0) / 2));

const supprimer = async () => {
  suppression.value = true;
  try {
    await useCases.projects.deleteProject.execute(Number(route.params.id));
    toasts.succes('Projet supprimé.');
    router.push('/projects');
  } catch (e) {
    toasts.erreur(e.message);
    confirmation.value = false;
  } finally {
    suppression.value = false;
  }
};

const dupliquer = async () => {
  duplication.value = true;
  try {
    const copie = await useCases.projects.createProject.execute({
      name: `${projet.value.name} (copie)`,
      description: projet.value.description,
      location: projet.value.location,
      surface: projet.value.surface,
      kind: projet.value.kind,
      status: 'DRAFT',
      materials: projet.value.lines.map((l) => ({
        materialId: l.materialId,
        quantity: l.quantity,
      })),
    });
    toasts.succes('Projet dupliqué.');
    router.push(`/projects/${copie.id}`);
  } catch (e) {
    toasts.erreur(e.message);
  } finally {
    duplication.value = false;
  }
};

const exporter = () => {
  telechargerCsv(projetEnCsv(projet.value), `${projet.value.name}.csv`);
  toasts.succes('Export CSV téléchargé.');
};

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return;
    chargement.value = true;
    erreur.value = '';
    try {
      projet.value = await useCases.projects.getProject.execute(Number(id));
    } catch (e) {
      projet.value = null;
      erreur.value = e.message;
    } finally {
      chargement.value = false;
    }
  },
  { immediate: true },
);
</script>
