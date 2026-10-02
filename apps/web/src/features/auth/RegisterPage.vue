<template>
  <AuthLayout title="Créer un compte" subtitle="Quelques secondes suffisent pour commencer.">
    <form class="space-y-5" @submit.prevent="register">
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

      <AppField
        id="name"
        v-model="formState.name"
        label="Nom"
        placeholder="Votre nom"
        autocomplete="name"
      />

      <AppField
        id="email"
        v-model="formState.email"
        label="Adresse email"
        type="email"
        placeholder="vous@exemple.fr"
        autocomplete="email"
        :error="formState.emailError"
      />

      <div>
        <AppField
          id="password"
          v-model="formState.password"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          @update:model-value="validatePassword"
        />
        <PasswordCriteria :criteria="formState.passwordCriteria" />
      </div>

      <AppButton type="submit" block :loading="isLoading">
        {{ isLoading ? 'Création…' : 'Créer mon compte' }}
      </AppButton>
    </form>

    <template #footer>
      Vous avez déjà un compte&nbsp;?
      <RouterLink to="/login" class="font-medium text-accent hover:underline">
        Se connecter
      </RouterLink>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { registerUser } from '@/api/auth';
import AuthLayout from '@/features/auth/AuthLayout.vue';
import PasswordCriteria from '@/features/auth/components/PasswordCriteria.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import AppField from '@/shared/ui/AppField.vue';

const formState = ref({
  name: '',
  email: '',
  password: '',
  emailError: '',
  passwordCriteria: {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  },
});

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const validateEmail = () => {
  const motif = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  formState.value.emailError = motif.test(formState.value.email)
    ? ''
    : "Le format de l'email est invalide";
};

const validatePassword = (valeur = formState.value.password) => {
  const criteres = formState.value.passwordCriteria;
  criteres.length = valeur.length >= 8;
  criteres.uppercase = /[A-Z]/.test(valeur);
  criteres.lowercase = /[a-z]/.test(valeur);
  criteres.number = /\d/.test(valeur);
  criteres.symbol = /[^A-Za-z\d\s]/.test(valeur);
};

const register = async () => {
  errorMessage.value = '';
  validateEmail();
  validatePassword();

  if (formState.value.emailError) {
    errorMessage.value = formState.value.emailError;
    return;
  }
  if (!Object.values(formState.value.passwordCriteria).every(Boolean)) {
    errorMessage.value = 'Le mot de passe ne remplit pas tous les critères';
    return;
  }

  isLoading.value = true;
  try {
    await registerUser({
      name: formState.value.name,
      email: formState.value.email,
      password: formState.value.password,
    });
    successMessage.value = 'Compte créé. Redirection vers la connexion…';
    setTimeout(() => router.push('/login'), 1200);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
