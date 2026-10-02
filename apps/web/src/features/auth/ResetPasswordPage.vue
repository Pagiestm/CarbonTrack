<template>
  <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe solide.">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <p
        v-if="errorMessage"
        role="alert"
        class="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2.5 text-sm text-danger"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="successMessage"
        role="status"
        class="rounded-lg border border-success/40 bg-success-soft px-3 py-2.5 text-sm text-success"
      >
        {{ successMessage }}
      </p>

      <div>
        <AppField
          id="newPassword"
          v-model="newPassword"
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          :error="errors.newPassword"
          @update:model-value="validatePassword"
        />
        <PasswordCriteria :criteria="criteres" />
      </div>

      <AppField
        id="confirmPassword"
        v-model="confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      />

      <AppButton type="submit" block :loading="isLoading">
        {{ isLoading ? 'Enregistrement…' : 'Changer mon mot de passe' }}
      </AppButton>
    </form>
  </AuthLayout>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { checkToken, resetPassword } from '@/api/auth';
import AuthLayout from '@/features/auth/AuthLayout.vue';
import PasswordCriteria from '@/features/auth/components/PasswordCriteria.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import AppField from '@/shared/ui/AppField.vue';

const route = useRoute();
const router = useRouter();
const token = route.query.token;

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errors = ref({});
const errorMessage = ref('');
const successMessage = ref('');

const criteres = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  symbol: false,
});

const validatePassword = (valeur = newPassword.value) => {
  criteres.length = valeur.length >= 8;
  criteres.uppercase = /[A-Z]/.test(valeur);
  criteres.lowercase = /[a-z]/.test(valeur);
  criteres.number = /\d/.test(valeur);
  criteres.symbol = /[^A-Za-z\d\s]/.test(valeur);
};

const handleSubmit = async () => {
  errors.value = {};
  errorMessage.value = '';
  validatePassword();

  if (!Object.values(criteres).every(Boolean)) {
    errors.value.newPassword = 'Le mot de passe ne remplit pas tous les critères';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas';
    return;
  }

  isLoading.value = true;
  try {
    await resetPassword(token, newPassword.value, confirmPassword.value);
    successMessage.value = 'Mot de passe modifié. Redirection vers la connexion…';
    setTimeout(() => router.push('/login'), 1200);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// Un lien invalide, expiré ou déjà utilisé ne doit pas afficher le formulaire.
onMounted(async () => {
  try {
    await checkToken(token);
  } catch {
    router.replace({ name: 'NotFound', params: { pathMatch: ['reset-password'] } });
  }
});

watch(confirmPassword, (valeur) => {
  if (valeur === newPassword.value) errors.value.confirmPassword = '';
});
</script>
