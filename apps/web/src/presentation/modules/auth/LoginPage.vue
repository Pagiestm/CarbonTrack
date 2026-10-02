<template>
  <AuthLayout title="Content de vous revoir" subtitle="Connectez-vous pour accéder à vos projets.">
    <form class="space-y-5" novalidate @submit.prevent="connecter">
      <AppAlert v-if="session.erreur">{{ session.erreur }}</AppAlert>

      <AppField
        id="email"
        v-model="formulaire.email"
        label="Adresse email"
        type="email"
        :icon="Mail"
        placeholder="vous@exemple.fr"
        autocomplete="email"
        :error="erreurEmail"
      />

      <div>
        <AppField
          id="password"
          v-model="formulaire.password"
          label="Mot de passe"
          type="password"
          :icon="Lock"
          placeholder="••••••••"
          autocomplete="current-password"
          :error="erreurMotDePasse"
        />
        <RouterLink
          to="/password-reset/request"
          class="mt-2 inline-block text-sm text-accent hover:underline"
        >
          Mot de passe oublié&nbsp;?
        </RouterLink>
      </div>

      <AppButton type="submit" block :loading="session.chargement">Se connecter</AppButton>
    </form>

    <div class="my-6 flex items-center gap-3">
      <span class="h-px flex-1 bg-line" />
      <span class="text-xs text-ink-subtle">ou</span>
      <span class="h-px flex-1 bg-line" />
    </div>

    <AppButton variant="secondary" block @click="session.connecterAvecGoogle()">
      <GoogleLogo class="size-5" />
      Continuer avec Google
    </AppButton>

    <template #footer>
      Vous n'avez pas de compte&nbsp;?
      <RouterLink to="/register" class="font-medium text-accent hover:underline">
        Créer un compte
      </RouterLink>
    </template>

    <template #aside>
      <MaterialOfTheDay />
    </template>
  </AuthLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Lock, Mail } from 'lucide-vue-next';
import { useSessionStore } from '@/presentation/stores/session.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import GoogleLogo from '@/presentation/components/ui/GoogleLogo.vue';
import MaterialOfTheDay from '@/presentation/modules/auth/components/MaterialOfTheDay.vue';

const session = useSessionStore();
const router = useRouter();
const route = useRoute();
const formulaire = reactive({ email: '', password: '' });

const destination = () => route.query.suite ?? '/';

const erreurEmail = ref('');
const erreurMotDePasse = ref('');

const connecter = async () => {
  erreurEmail.value = '';
  erreurMotDePasse.value = '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulaire.email)) {
    erreurEmail.value = "Le format de l'email est invalide";
  }
  if (!formulaire.password) {
    erreurMotDePasse.value = 'Le mot de passe est requis';
  }
  if (erreurEmail.value || erreurMotDePasse.value) return;

  if (await session.connecter({ ...formulaire })) router.push(destination());
};

onMounted(() => {
  if (session.recupererJetonDeLUrl()) router.push(destination());
});
</script>
