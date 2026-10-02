<template>
  <AppShell>
    <div class="mx-auto max-w-xl">
      <PageHeader eyebrow="Mon compte" title="Modifier mon profil" />

      <AppCard>
        <form class="space-y-5" novalidate @submit.prevent="enregistrer">
          <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

          <AppField
            id="name"
            v-model="formulaire.name"
            label="Nom"
            :icon="User"
            :error="erreurs.etat.parChamp.name"
          />

          <div class="grid gap-5 sm:grid-cols-2">
            <AppField
              id="company"
              v-model="formulaire.company"
              label="Entreprise"
              :icon="Building2"
              :required="false"
              :error="erreurs.etat.parChamp.company"
            />
            <AppField
              id="jobTitle"
              v-model="formulaire.jobTitle"
              label="Fonction"
              :icon="Briefcase"
              :required="false"
              placeholder="Architecte, maçon…"
              :error="erreurs.etat.parChamp.jobTitle"
            />
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <AppField
              id="phone"
              v-model="formulaire.phone"
              label="Téléphone"
              type="tel"
              :icon="Phone"
              :required="false"
              :error="erreurs.etat.parChamp.phone"
            />
            <AppField
              id="city"
              v-model="formulaire.city"
              label="Ville"
              :icon="MapPin"
              :required="false"
              :error="erreurs.etat.parChamp.city"
            />
          </div>

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
            :error="erreurs.etat.parChamp.email"
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
import { Briefcase, Building2, Mail, MapPin, Phone, User } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const router = useRouter();
const toasts = useToasts();
const formulaire = reactive({
  name: '',
  email: '',
  company: '',
  jobTitle: '',
  phone: '',
  city: '',
});
const compteGoogle = ref(false);
const erreurs = useFormErrors(['name', 'email', 'company', 'jobTitle', 'phone', 'city']);
const chargement = ref(false);

const enregistrer = async () => {
  erreurs.reinitialiser();
  if (!formulaire.name.trim()) {
    erreurs.poser('name', 'Le nom est requis');
    return;
  }
  chargement.value = true;
  try {
    const nettoye = Object.fromEntries(
      Object.entries(formulaire).map(([cle, valeur]) => [cle, valeur === '' ? null : valeur]),
    );
    if (compteGoogle.value) delete nettoye.email;
    const champs = nettoye;
    await useCases.users.updateProfile.execute(champs);
    toasts.succes('Profil mis à jour.');
    router.push('/profile');
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};

onMounted(async () => {
  try {
    const utilisateur = await useCases.users.getProfile.execute();
    Object.assign(formulaire, {
      name: utilisateur.name,
      email: utilisateur.email,
      company: utilisateur.company ?? '',
      jobTitle: utilisateur.jobTitle ?? '',
      phone: utilisateur.phone ?? '',
      city: utilisateur.city ?? '',
    });
    compteGoogle.value = utilisateur.isGoogleAccount;
  } catch (e) {
    erreurs.depuisApi(e);
  }
});
</script>
