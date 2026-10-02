import { ref, watch } from 'vue';
import { Page } from '@/domain/entities/Page.js';

export const usePagedList = (charger, { perPage = 12, delaiRecherche = 300 } = {}) => {
  const resultat = ref(Page.vide());
  const page = ref(1);
  const recherche = ref('');
  const chargement = ref(false);
  const erreur = ref('');

  let minuteur;
  let dernierAppel = 0;

  const rafraichir = async () => {
    const appel = (dernierAppel += 1);
    chargement.value = true;
    erreur.value = '';
    try {
      const reponse = await charger({
        page: page.value,
        perPage,
        search: recherche.value.trim() || undefined,
      });
      if (appel === dernierAppel) resultat.value = reponse;
    } catch (e) {
      if (appel === dernierAppel) erreur.value = e.message;
    } finally {
      if (appel === dernierAppel) chargement.value = false;
    }
  };

  watch(page, rafraichir);

  watch(recherche, () => {
    clearTimeout(minuteur);
    minuteur = setTimeout(() => {
      if (page.value === 1) rafraichir();
      else page.value = 1;
    }, delaiRecherche);
  });

  return { resultat, page, recherche, chargement, erreur, rafraichir };
};
