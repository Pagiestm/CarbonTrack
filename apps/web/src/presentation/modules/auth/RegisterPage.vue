<template>
  <AuthLayout title="Créer un compte" subtitle="Quelques secondes suffisent pour commencer.">
    <form class="space-y-5" @submit.prevent="inscrire">
      <AppAlert v-if="erreur">{{ erreur }}</AppAlert>
      <AppAlert v-if="succes" tone="success">{{ succes }}</AppAlert>

      <AppField
        id="name"
        v-model="formulaire.name"
        label="Nom"
        :icon="User"
        placeholder="Votre nom"
        autocomplete="name"
      />

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
          autocomplete="new-password"
          @update:model-value="evaluer"
        />
        <PasswordCriteria :criteria="criteres" />
      </div>

      <AppButton type="submit" block :loading="chargement">Créer mon compte</AppButton>
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
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Lock, Mail, User } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import PasswordCriteria from '@/presentation/modules/auth/components/PasswordCriteria.vue';
import { usePasswordCriteria } from '@/presentation/modules/auth/components/usePasswordCriteria.js';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const router = useRouter();
const formulaire = reactive({ name: '', email: '', password: '' });
const { criteres, evaluer, toutValide } = usePasswordCriteria();

const erreur = ref('');
const succes = ref('');
const erreurEmail = ref('');
const chargement = ref(false);

const inscrire = async () => {
  erreur.value = '';
  erreurEmail.value = '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulaire.email)) {
    erreurEmail.value = "Le format de l'email est invalide";
    return;
  }
  evaluer(formulaire.password);
  if (!toutValide()) {
    erreur.value = 'Le mot de passe ne remplit pas tous les critères';
    return;
  }

  chargement.value = true;
  try {
    await useCases.auth.register.execute({ ...formulaire });
    succes.value = 'Compte créé. Redirection vers la connexion…';
    setTimeout(() => router.push('/login'), 1200);
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};
</script>
