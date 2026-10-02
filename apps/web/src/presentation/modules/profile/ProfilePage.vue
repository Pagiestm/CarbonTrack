<template>
  <AppShell>
    <PageHeader eyebrow="Mon compte" title="Profil">
      <template #actions>
        <AppButton to="/profile/password" variant="secondary" :icon="KeyRound">
          Mot de passe
        </AppButton>
        <AppButton to="/profile/edit" variant="secondary" :icon="Pencil">Modifier</AppButton>
      </template>

    </PageHeader>


    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>


    <div v-if="utilisateur" class="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <AppCard>
        <div class="flex flex-col items-center text-center">
          <div
            class="flex size-20 items-center justify-center rounded-full bg-accent-soft text-2xl font-bold text-accent"
          >
            {{ utilisateur.initials || '?' }}
          </div>


          <p class="mt-4 font-semibold text-ink">{{ utilisateur.name }}</p>


          <p v-if="utilisateur.subtitle" class="text-sm text-ink-muted">
            {{ utilisateur.subtitle }}
          </p>


          <p class="mt-1 text-sm text-ink-subtle">{{ utilisateur.email }}</p>


          <span
            v-if="utilisateur.isAdmin"
            class="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
          >
            <ShieldCheck class="size-3.5" aria-hidden="true" />
            Administrateur
          </span>

        </div>

      </AppCard>


      <div class="space-y-6">
        <AppCard title="Informations">
          <dl class="divide-y divide-line">
            <div
              v-for="champ in champs"
              :key="champ.libelle"
              class="flex justify-between py-3 text-sm"
            >
              <dt class="text-ink-muted">{{ champ.libelle }}</dt>


              <dd class="text-ink">{{ champ.valeur }}</dd>

            </div>

          </dl>

        </AppCard>


        <AppCard
          title="Supprimer mon compte"
          subtitle="Votre compte et tous vos projets seront définitivement effacés."
        >
          <AppButton variant="danger" :icon="Trash2" @click="confirmation = true">
            Supprimer mon compte
          </AppButton>

        </AppCard>

      </div>

    </div>


    <ConfirmDialog
      v-if="confirmation"
      title="Supprimer votre compte ?"
      description="Cette action est irréversible : vos projets seront effacés avec le compte."
      confirm-label="Supprimer définitivement"
      :loading="suppression"
      @cancel="confirmation = false"
      @confirm="supprimer"
    />
  </AppShell>

</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { KeyRound, Pencil, ShieldCheck, Trash2 } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import { useSessionStore } from '@/presentation/stores/session.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';

const router = useRouter();
const toasts = useToasts();
const session = useSessionStore();

const utilisateur = ref(null);
const erreur = ref('');
const confirmation = ref(false);
const suppression = ref(false);

const champs = computed(() => [
  { libelle: 'Nom', valeur: utilisateur.value.name },
  { libelle: 'Email', valeur: utilisateur.value.email },
  { libelle: 'Entreprise', valeur: utilisateur.value.company ?? '—' },
  { libelle: 'Fonction', valeur: utilisateur.value.jobTitle ?? '—' },
  { libelle: 'Téléphone', valeur: utilisateur.value.phone ?? '—' },
  { libelle: 'Ville', valeur: utilisateur.value.city ?? '—' },
  {
    libelle: 'Connexion',
    valeur: utilisateur.value.isGoogleAccount ? 'Compte Google' : 'Email et mot de passe',
  },
  {
    libelle: 'Inscrit le',
    valeur: new Date(utilisateur.value.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  },
]);

const supprimer = async () => {
  suppression.value = true;
  try {
    await useCases.users.deleteAccount.execute();
    session.rafraichir();
    toasts.succes('Votre compte a été supprimé.');
    router.push('/');
  } catch (e) {
    erreur.value = e.message;
    confirmation.value = false;
  } finally {
    suppression.value = false;
  }
};

onMounted(async () => {
  try {
    utilisateur.value = await useCases.users.getProfile.execute();
  } catch (e) {
    erreur.value = e.message;
  }
});
</script>

