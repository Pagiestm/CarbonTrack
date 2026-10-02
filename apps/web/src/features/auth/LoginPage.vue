<template>
  <AuthLayout title="Content de vous revoir" subtitle="Connectez-vous pour accéder à vos projets.">
    <form class="space-y-5" @submit.prevent="login">
      <p
        v-if="errorMessage"
        role="alert"
        class="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2.5 text-sm text-danger"
      >
        {{ errorMessage }}
      </p>

      <AppField
        id="email"
        v-model="formState.email"
        label="Adresse email"
        type="email"
        placeholder="vous@exemple.fr"
        autocomplete="email"
      />

      <div>
        <AppField
          id="password"
          v-model="formState.password"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />
        <RouterLink
          to="/password-reset/request"
          class="mt-2 inline-block text-sm text-accent hover:underline"
        >
          Mot de passe oublié&nbsp;?
        </RouterLink>
      </div>

      <AppButton type="submit" block :loading="isLoading">
        {{ isLoading ? 'Connexion…' : 'Se connecter' }}
      </AppButton>
    </form>

    <div class="my-6 flex items-center gap-3">
      <span class="h-px flex-1 bg-line" />
      <span class="text-xs text-ink-subtle">ou</span>
      <span class="h-px flex-1 bg-line" />
    </div>

    <AppButton variant="secondary" block @click="loginWithGoogle">
      <GoogleLogo class="size-5" />
      Continuer avec Google
    </AppButton>

    <template #footer>
      Vous n'avez pas de compte&nbsp;?
      <RouterLink to="/register" class="font-medium text-accent hover:underline">
        Créer un compte
      </RouterLink>
    </template>
  </AuthLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { googleAuth, loginUser } from '@/api/auth';
import { consumeTokenFromUrl, saveSession } from '@/shared/auth/session';
import AuthLayout from '@/features/auth/AuthLayout.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import AppField from '@/shared/ui/AppField.vue';
import GoogleLogo from '@/shared/ui/GoogleLogo.vue';

const formState = ref({ email: '', password: '' });
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const login = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const { token } = await loginUser({ ...formState.value });
    saveSession(token);
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const loginWithGoogle = () => {
  try {
    googleAuth();
  } catch {
    errorMessage.value = 'La connexion avec Google a échoué, veuillez réessayer';
  }
};

// Retour de la connexion Google : le jeton arrive dans le fragment de l'URL.
onMounted(() => {
  if (consumeTokenFromUrl()) {
    router.push('/');
  }
});
</script>
