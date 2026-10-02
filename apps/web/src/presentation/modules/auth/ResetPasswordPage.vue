<template>
  <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe solide.">
    <form class="space-y-5" @submit.prevent="enregistrer">
      <AppAlert v-if="erreur">{{ erreur }}</AppAlert>
      <AppAlert v-if="succes" tone="success">{{ succes }}</AppAlert>

      <div>
        <AppField
          id="newPassword"
          v-model="nouveau"
          label="Nouveau mot de passe"
          type="password"
          :icon="Lock"
          placeholder="••••••••"
          autocomplete="new-password"
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
        :error="erreurConfirmation"
      />

      <AppButton type="submit" block :loading="chargement">Changer mon mot de passe</AppButton>
    </form>
  </AuthLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Lock } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import PasswordCriteria from '@/presentation/modules/auth/components/PasswordCriteria.vue';
import { usePasswordCriteria } from '@/presentation/modules/auth/components/usePasswordCriteria.js';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const route = useRoute();
const router = useRouter();
const token = route.query.token;

const nouveau = ref('');
const confirmation = ref('');
const erreur = ref('');
const succes = ref('');
const erreurConfirmation = ref('');
const chargement = ref(false);
const { criteres, evaluer, toutValide } = usePasswordCriteria();

const enregistrer = async () => {
  erreur.value = '';
  erreurConfirmation.value = '';
  evaluer(nouveau.value);

  if (!toutValide()) {
    erreur.value = 'Le mot de passe ne remplit pas tous les critères';
    return;
  }

  chargement.value = true;
  try {
    await useCases.auth.resetPassword.execute({
      token,
      newPassword: nouveau.value,
      confirmPassword: confirmation.value,
    });
    succes.value = 'Mot de passe modifié. Redirection vers la connexion…';
    setTimeout(() => router.push('/login'), 1200);
  } catch (e) {
    erreurConfirmation.value = e.message.includes('correspondent') ? e.message : '';
    erreur.value = erreurConfirmation.value ? '' : e.message;
  } finally {
    chargement.value = false;
  }
};

// Un lien invalide, expiré ou déjà utilisé ne doit pas afficher le formulaire.
onMounted(async () => {
  try {
    await useCases.auth.checkResetToken.execute(token);
  } catch {
    router.replace({ name: 'NotFound', params: { pathMatch: ['reset-password'] } });
  }
});

watch(confirmation, (valeur) => {
  if (valeur === nouveau.value) erreurConfirmation.value = '';
});
</script>
