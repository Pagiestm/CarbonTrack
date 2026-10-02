<template>
  <AppShell>
    <div class="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre projet"
        subtitle="Une question sur le calcul, un matériau manquant, un bug ? Écrivez-nous."
      />

      <AppCard>
        <form v-if="!envoye" class="space-y-5" @submit.prevent="envoyer">
          <AppAlert v-if="erreur">{{ erreur }}</AppAlert>

          <div class="grid gap-5 sm:grid-cols-2">
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
              label="Email"
              type="email"
              :icon="Mail"
              placeholder="vous@exemple.fr"
              autocomplete="email"
            />
          </div>

          <AppField
            id="subject"
            v-model="formulaire.subject"
            label="Sujet"
            :icon="Tag"
            placeholder="De quoi s'agit-il ?"
          />

          <AppField
            id="message"
            v-model="formulaire.message"
            label="Message"
            multiline
            :rows="6"
            placeholder="Décrivez votre demande…"
            hint="Quelques phrases suffisent."
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
import AppShell from '@/presentation/components/ui/AppShell.vue';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import AppField from '@/presentation/components/ui/AppField.vue';

const formulaire = reactive({ name: '', email: '', subject: '', message: '' });
const erreur = ref('');
const envoye = ref(false);
const chargement = ref(false);

const envoyer = async () => {
  erreur.value = '';
  chargement.value = true;
  try {
    await useCases.contact.sendContactMessage.execute({ ...formulaire });
    envoye.value = true;
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
};
</script>
