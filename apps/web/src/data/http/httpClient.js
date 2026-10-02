import axios from 'axios';

/**
 * Client HTTP unique. Seule la couche data le connaît : ni le domaine ni les
 * composants n'importent axios.
 *
 * Le jeton est lu à chaque requête via la fonction passée à la construction,
 * plutôt qu'au démarrage : une connexion en cours de session est ainsi prise
 * en compte sans recréer le client.
 */
export const createHttpClient = ({ baseURL, getToken }) => {
  const client = axios.create({ baseURL, headers: { Accept: 'application/json' } });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Les erreurs HTTP deviennent des Error portant le message de l'API, pour
  // que les couches du dessus n'aient jamais à inspecter une réponse axios.
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const corps = error.response?.data;
      const erreur = new Error(
        corps?.error ?? 'Impossible de joindre le serveur, veuillez réessayer',
      );
      erreur.status = error.response?.status;
      erreur.details = corps?.details;
      return Promise.reject(erreur);
    },
  );

  return client;
};
