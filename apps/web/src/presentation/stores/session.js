import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCases } from '@/container.js';

export const useSessionStore = defineStore('session', () => {
  const session = ref(useCases.auth.currentSession.execute());
  const user = ref(null);
  const chargement = ref(false);
  const erreur = ref('');

  const estConnecte = computed(() => Boolean(session.value?.isValid));
  const estAdmin = computed(() => estConnecte.value && session.value.isAdmin);

  const rafraichir = () => {
    session.value = useCases.auth.currentSession.execute();
  };

  const connecter = async ({ email, password }) => {
    chargement.value = true;
    erreur.value = '';
    try {
      session.value = await useCases.auth.login.execute({ email, password });
      return true;
    } catch (e) {
      erreur.value = e.message;
      return false;
    } finally {
      chargement.value = false;
    }
  };

  const connecterAvecGoogle = () => {
    window.location.href = useCases.auth.startGoogleLogin.execute();
  };

  const recupererJetonDeLUrl = () => {
    const recuperee = useCases.auth.finishGoogleLogin.execute();
    if (recuperee) session.value = recuperee;
    return Boolean(recuperee);
  };

  const deconnecter = () => {
    useCases.auth.logout.execute();
    session.value = null;
    user.value = null;
  };

  const chargerProfil = async () => {
    if (!estConnecte.value) return null;
    user.value = await useCases.users.getProfile.execute();
    return user.value;
  };

  return {
    session,
    user,
    chargement,
    erreur,
    estConnecte,
    estAdmin,
    rafraichir,
    connecter,
    connecterAvecGoogle,
    recupererJetonDeLUrl,
    deconnecter,
    chargerProfil,
  };
});
