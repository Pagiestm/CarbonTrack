<template>
  <AuthLayout title="Créer un compte" subtitle="Quelques secondes suffisent pour commencer.">
    <form class="space-y-5" novalidate @submit.prevent="inscrire">
      <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

      <AppField
        id="name"
        v-model="formulaire.name"
        label="Nom"
        :icon="User"
        placeholder="Votre nom"
        autocomplete="name"
        :error="erreurs.etat.parChamp.name"
      />

      <AppField
        id="email"
        v-model="formulaire.email"
        label="Adresse email"
        type="email"
        :icon="Mail"
        placeholder="vous@exemple.fr"
        autocomplete="email"
        :error="erreurs.etat.parChamp.email"
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
          :error="erreurs.etat.parChamp.password"
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


    <template #aside>
      <WhyRegister />
    </template>

  </AuthLayout>

</template>


<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Lock, Mail, User } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import PasswordCriteria from '@/presentation/modules/auth/components/PasswordCriteria.vue';
import { usePasswordCriteria } from '@/presentation/modules/auth/components/usePasswordCriteria.js';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import WhyRegister from '@/presentation/modules/auth/components/WhyRegister.vue';

const router = useRouter();
const toasts = useToasts();
const erreurs = useFormErrors(['name', 'email', 'password']);
const { criteres, evaluer, toutValide } = usePasswordCriteria();

const formulaire = reactive({ name: '', email: '', password: '' });
const chargement = ref(false);

const valider = () => {
  erreurs.reinitialiser();

  if (!formulaire.name.trim()) erreurs.poser('name', 'Le nom est requis');
  if (!formulaire.email.trim()) erreurs.poser('email', "L'email est requis");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulaire.email)) {
    erreurs.poser('email', "Le format de l'email est invalide");
  }

  evaluer(formulaire.password);
  if (!formulaire.password) erreurs.poser('password', 'Le mot de passe est requis');
  else if (!toutValide())
    erreurs.poser('password', 'Tous les critères ci-dessous doivent être remplis');

  return !erreurs.aDesErreurs();
};

const inscrire = async () => {
  if (!valider()) return;

  chargement.value = true;
  try {
    await useCases.auth.register.execute({ ...formulaire });
    toasts.succes('Compte créé, vous pouvez vous connecter.');
    router.push('/login');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};
</script>

