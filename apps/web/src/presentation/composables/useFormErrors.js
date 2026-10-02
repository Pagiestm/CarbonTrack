import { reactive } from 'vue';

export const useFormErrors = (champs = []) => {
  const etat = reactive({ parChamp: {}, general: '' });

  const connus = new Set(champs);

  const reinitialiser = () => {
    for (const cle of Object.keys(etat.parChamp)) delete etat.parChamp[cle];
    etat.general = '';
  };

  const poser = (champ, message) => {
    etat.parChamp[champ] = message;
  };

  const depuisApi = (erreur) => {
    reinitialiser();

    const details = erreur.details ?? [];
    const orphelins = [];

    for (const { field, message } of details) {
      const racine = String(field ?? '').split('.')[0];
      if (connus.has(racine)) etat.parChamp[racine] = message;
      else orphelins.push(message);
    }

    if (!details.length || orphelins.length) {
      etat.general = orphelins.length ? orphelins.join(' ') : erreur.message;
    }
  };

  const aDesErreurs = () => Object.keys(etat.parChamp).length > 0 || Boolean(etat.general);

  const oublier = (champ) => {
    delete etat.parChamp[champ];
  };

  return { etat, reinitialiser, poser, oublier, depuisApi, aDesErreurs };
};
