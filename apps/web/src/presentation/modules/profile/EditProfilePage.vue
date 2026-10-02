<template>
  <AppShell>
    <div class="mx-auto max-w-xl">
      <PageHeader eyebrow="Mon compte" title="Modifier mon profil" />

      <AppCard>
        <form class="space-y-5" @submit.prevent="enregistrer">
          <AppAlert v-if="erreur">{{ erreur }}</AppAlert>
          <AppAlert v-if="succes" tone="success">{{ succes }}</AppAlert>

          <AppField id="name" v-model="formulaire.name" label="Nom" :icon="User" />

          <AppField
            id="email"
            v-model="formulaire.email"
            label="Adresse email"
            type="email"
            :icon="Mail"
            :disabled="compteGoogle"
            :hint="
              compteGoogle ? 'Adresse fournie par Google, elle ne peut pas être modifiée ici.' : ''
            "
          />

          <div class="flex justify-end gap-3">
            <AppButton to="/profile" variant="secondary">Annuler</AppButton>
            <AppButton type="submit" :loading="chargement">Enregistrer</AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, User } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const router = useRouter();
const formulaire = reactive({ name: '', email: '' });
const compteGoogle = ref(false);
const erreur = ref('');
const succes = ref('');
const chargement = ref(false);

const enregistrer = async () => {
  erreur.value = '';
  succes.value = '';
  chargement.value = true;
  try {
    const champs = compteGoogle.value ? { name: formulaire.name } : { ...formulaire };
    await useCases.users.updateProfile.execute(champs);
    succes.value = 'Profil mis à jour.';
    setTimeout(() => router.push('/profile'), 900);
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  try {
    const utilisateur = await useCases.users.getProfile.execute();
    formulaire.name = utilisateur.name;
    formulaire.email = utilisateur.email;
    compteGoogle.value = utilisateur.isGoogleAccount;
  } catch (e) {
    erreur.value = e.message;
  }
});
</script>
