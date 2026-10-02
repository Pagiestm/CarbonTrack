<template>
  <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe solide.">
    <form class="space-y-5" novalidate @submit.prevent="enregistrer">
      <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

      <div>
        <AppField
          id="newPassword"
          v-model="nouveau"
          label="Nouveau mot de passe"
          type="password"
          :icon="Lock"
          placeholder="••••••••"
          autocomplete="new-password"
          :error="erreurs.etat.parChamp.newPassword"
          @update:model-value="evaluer"
        />
        <PasswordCriteria :criteria="criteres" />
      </div>

      <AppField
        id="confirmPassword"
        v-model="confirmation"
        label="Confirmer le mot de passe"
        type="password"
        :icon="Lock"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="erreurs.etat.parChamp.confirmPassword"
      />

      <AppButton type="submit" block :loading="chargement">Changer mon mot de passe</AppButton>
    </form>
    <template #aside>
      <MaterialOfTheDay />
    </template>
  </AuthLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Lock } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import PasswordCriteria from '@/presentation/modules/auth/components/PasswordCriteria.vue';
import { usePasswordCriteria } from '@/presentation/modules/auth/components/usePasswordCriteria.js';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import MaterialOfTheDay from '@/presentation/modules/auth/components/MaterialOfTheDay.vue';

const route = useRoute();
const router = useRouter();
const toasts = useToasts();
const token = route.query.token;

const nouveau = ref('');
const confirmation = ref('');
const erreurs = useFormErrors(['newPassword', 'confirmPassword']);
const chargement = ref(false);
const { criteres, evaluer, toutValide } = usePasswordCriteria();

const enregistrer = async () => {
  erreurs.reinitialiser();
  evaluer(nouveau.value);

  if (!toutValide()) {
    erreurs.poser('newPassword', 'Tous les critères ci-dessous doivent être remplis');
  }
  if (confirmation.value !== nouveau.value) {
    erreurs.poser('confirmPassword', 'Les mots de passe ne correspondent pas');
  }
  if (erreurs.aDesErreurs()) return;

  chargement.value = true;
  try {
    await useCases.auth.resetPassword.execute({
      token,
      newPassword: nouveau.value,
      confirmPassword: confirmation.value,
    });
    toasts.succes('Mot de passe modifié, connectez-vous.');
    router.push('/login');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  try {
    await useCases.auth.checkResetToken.execute(token);
  } catch {
    router.replace({ name: 'NotFound', params: { pathMatch: ['reset-password'] } });
  }
});

watch(confirmation, (valeur) => {
  if (valeur === nouveau.value) erreurs.oublier('confirmPassword');
});
</script>
