<template>
  <AppShell>
    <div class="mx-auto max-w-xl">
      <PageHeader eyebrow="Mon compte" title="Changer de mot de passe" />

      <AppCard v-if="compteGoogle">
        <AppAlert tone="info">
          Ce compte se connecte avec Google : il n'a pas de mot de passe à modifier ici.
        </AppAlert>
        <AppButton to="/profile" variant="secondary" class="mt-5">Retour au profil</AppButton>
      </AppCard>

      <AppCard v-else>
        <form class="space-y-5" novalidate @submit.prevent="enregistrer">
          <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

          <AppField
            id="currentPassword"
            v-model="formulaire.currentPassword"
            label="Mot de passe actuel"
            type="password"
            :icon="Lock"
            autocomplete="current-password"
            :error="erreurs.etat.parChamp.currentPassword"
          />

          <div>
            <AppField
              id="newPassword"
              v-model="formulaire.newPassword"
              label="Nouveau mot de passe"
              type="password"
              :icon="KeyRound"
              autocomplete="new-password"
              :error="erreurs.etat.parChamp.newPassword"
              @update:model-value="evaluer"
            />
            <PasswordCriteria :criteria="criteres" />
          </div>

          <AppField
            id="confirmPassword"
            v-model="formulaire.confirmPassword"
            label="Confirmer le nouveau mot de passe"
            type="password"
            :icon="KeyRound"
            autocomplete="new-password"
            :error="erreurs.etat.parChamp.confirmPassword"
          />

          <div class="flex justify-end gap-3">
            <AppButton to="/profile" variant="secondary">Annuler</AppButton>
            <AppButton type="submit" :loading="chargement">Changer le mot de passe</AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { KeyRound, Lock } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import { usePasswordCriteria } from '@/presentation/modules/auth/components/usePasswordCriteria.js';
import PasswordCriteria from '@/presentation/modules/auth/components/PasswordCriteria.vue';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const router = useRouter();
const toasts = useToasts();
const { criteres, evaluer, toutValide } = usePasswordCriteria();

const formulaire = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });
const erreurs = useFormErrors(['currentPassword', 'newPassword', 'confirmPassword']);
const chargement = ref(false);
const compteGoogle = ref(false);

const valider = () => {
  erreurs.reinitialiser();
  evaluer(formulaire.newPassword);

  if (!formulaire.currentPassword) {
    erreurs.poser('currentPassword', 'Le mot de passe actuel est requis');
  }
  if (!toutValide()) {
    erreurs.poser('newPassword', 'Tous les critères ci-dessous doivent être remplis');
  } else if (formulaire.newPassword === formulaire.currentPassword) {
    erreurs.poser('newPassword', "Choisissez un mot de passe différent de l'actuel");
  }
  if (formulaire.confirmPassword !== formulaire.newPassword) {
    erreurs.poser('confirmPassword', 'Les mots de passe ne correspondent pas');
  }
  return !erreurs.aDesErreurs();
};

const enregistrer = async () => {
  if (!valider()) return;

  chargement.value = true;
  try {
    await useCases.users.changePassword.execute({ ...formulaire });
    toasts.succes('Mot de passe modifié.');
    router.push('/profile');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  try {
    compteGoogle.value = (await useCases.users.getProfile.execute()).isGoogleAccount;
  } catch (e) {
    erreurs.etat.general = e.message;
  }
});

watch(
  () => formulaire.confirmPassword,
  (valeur) => {
    if (valeur === formulaire.newPassword) erreurs.oublier('confirmPassword');
  },
);
</script>
