<template>
  <AuthLayout
    title="Mot de passe oublié"
    subtitle="Entrez votre adresse email, nous vous enverrons un lien de réinitialisation."
  >
    <form v-if="!envoye" class="space-y-5" @submit.prevent="handleSubmit">
      <p
        v-if="errorMessage"
        role="alert"
        class="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2.5 text-sm text-danger"
      >
        {{ errorMessage }}
      </p>

      <AppField
        id="email"
        v-model="email"
        label="Adresse email"
        type="email"
        placeholder="vous@exemple.fr"
        autocomplete="email"
        :error="erreurEmail"
      />

      <AppButton type="submit" block :loading="isLoading">
        {{ isLoading ? 'Envoi…' : 'Envoyer le lien' }}
      </AppButton>
    </form>

    <div v-else class="text-center">
      <div
        class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success-soft"
      >
        <svg class="size-6 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
          />
        </svg>
      </div>
      <p class="text-ink">Si un compte existe pour cette adresse, le lien vient de partir.</p>
      <p class="mt-2 text-sm text-ink-muted">
        Pensez à regarder vos indésirables. Le lien est valable une heure.
      </p>
    </div>

    <template #footer>
      <RouterLink to="/login" class="font-medium text-accent hover:underline">
        Retour à la connexion
      </RouterLink>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { requestPasswordReset } from '@/api/auth';
import AuthLayout from '@/features/auth/AuthLayout.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import AppField from '@/shared/ui/AppField.vue';

const email = ref('');
const erreurEmail = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const envoye = ref(false);

const emailValide = (valeur) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);

const handleSubmit = async () => {
  errorMessage.value = '';
  if (!email.value) {
    erreurEmail.value = "L'email est requis";
    return;
  }
  if (!emailValide(email.value)) {
    erreurEmail.value = "Le format de l'email est invalide";
    return;
  }

  isLoading.value = true;
  try {
    await requestPasswordReset(email.value);
    envoye.value = true;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

watch(email, (valeur) => {
  if (emailValide(valeur)) erreurEmail.value = '';
});
</script>
