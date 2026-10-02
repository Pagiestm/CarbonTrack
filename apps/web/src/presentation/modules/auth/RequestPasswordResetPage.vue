<template>
  <AuthLayout
    title="Mot de passe oublié"
    subtitle="Entrez votre adresse email, nous vous enverrons un lien."
  >
    <form v-if="!envoye" class="space-y-5" novalidate @submit.prevent="envoyer">
      <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

      <AppField
        id="email"
        v-model="email"
        label="Adresse email"
        type="email"
        :icon="Mail"
        placeholder="vous@exemple.fr"
        autocomplete="email"
        :error="erreurEmail"
      />

      <AppButton type="submit" block :loading="chargement">Envoyer le lien</AppButton>
    </form>

    <div v-else class="text-center">
      <div
        class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-soft"
      >
        <MailCheck class="size-6 text-accent" aria-hidden="true" />
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


    <template #aside>
      <MaterialOfTheDay />
    </template>

  </AuthLayout>

</template>


<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Mail, MailCheck } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AuthLayout from '@/presentation/modules/auth/AuthLayout.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import MaterialOfTheDay from '@/presentation/modules/auth/components/MaterialOfTheDay.vue';

const email = ref('');
const erreurEmail = ref('');
const erreur = ref('');
const chargement = ref(false);
const envoye = ref(false);

const valide = (valeur) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);

const envoyer = async () => {
  erreur.value = '';
  if (!valide(email.value)) {
    erreurEmail.value = "Le format de l'email est invalide";
    return;
  }
  chargement.value = true;
  try {
    await useCases.auth.requestPasswordReset.execute(email.value);
    envoye.value = true;
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};

watch(email, (valeur) => {
  if (valide(valeur)) erreurEmail.value = '';
});
</script>

