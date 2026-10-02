<template>
  <AppShell>
    <div class="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre projet"
        subtitle="Une question sur le calcul, un matériau manquant, un bug ? Écrivez-nous."
      />

      <AppCard>
        <form v-if="!envoye" class="space-y-5" novalidate @submit.prevent="envoyer">
          <AppAlert v-if="erreurs.etat.general">{{ erreurs.etat.general }}</AppAlert>

          <div class="grid gap-5 sm:grid-cols-2">
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
              label="Email"
              type="email"
              :icon="Mail"
              placeholder="vous@exemple.fr"
              autocomplete="email"
              :error="erreurs.etat.parChamp.email"
            />
          </div>

          <AppField
            id="subject"
            v-model="formulaire.subject"
            label="Sujet"
            :icon="Tag"
            placeholder="De quoi s'agit-il ?"
            :error="erreurs.etat.parChamp.subject"
          />

          <AppField
            id="message"
            v-model="formulaire.message"
            label="Message"
            multiline
            :rows="6"
            placeholder="Décrivez votre demande…"
            hint="Quelques phrases suffisent."
            :error="erreurs.etat.parChamp.message"
          />

          <AppButton type="submit" :icon="Send" :loading="chargement">Envoyer</AppButton>
        </form>

        <div v-else class="py-6 text-center">
          <div
            class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-soft"
          >
            <MailCheck class="size-6 text-accent" aria-hidden="true" />
          </div>
          <p class="font-medium text-ink">Message envoyé</p>
          <p class="mt-2 text-sm text-ink-muted">Nous revenons vers vous sous quelques jours.</p>
          <AppButton to="/" variant="secondary" size="sm" class="mt-6">
            Retour à l'accueil
          </AppButton>
        </div>
      </AppCard>
    </div>
  </AppShell>
</template>


<script setup>
import { reactive, ref } from 'vue';
import { Mail, MailCheck, Send, Tag, User } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const formulaire = reactive({ name: '', email: '', subject: '', message: '' });
const erreurs = useFormErrors(['name', 'email', 'subject', 'message']);
const envoye = ref(false);
const chargement = ref(false);

const valider = () => {
  erreurs.reinitialiser();
  if (!formulaire.name.trim()) erreurs.poser('name', 'Le nom est requis');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulaire.email)) {
    erreurs.poser('email', "Le format de l'email est invalide");
  }
  if (!formulaire.subject.trim()) erreurs.poser('subject', 'Le sujet est requis');
  if (formulaire.message.trim().length < 10) {
    erreurs.poser('message', 'Le message doit faire au moins 10 caractères');
  }
  return !erreurs.aDesErreurs();
};

const envoyer = async () => {
  if (!valider()) return;
  chargement.value = true;
  try {
    await useCases.contact.sendContactMessage.execute({ ...formulaire });
    envoye.value = true;
  } catch (e) {
    erreurs.depuisApi(e);
  } finally {
    chargement.value = false;
  }
};
</script>

