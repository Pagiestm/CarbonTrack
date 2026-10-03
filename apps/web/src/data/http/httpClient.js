import axios from 'axios';

export const DELAI_MAX_MS = 60_000;

export const createHttpClient = ({ baseURL, getToken }) => {
  const client = axios.create({
    baseURL,
    timeout: DELAI_MAX_MS,
    headers: { Accept: 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const corps = error.response?.data;
      const parDefaut =
        error.code === 'ECONNABORTED'
          ? 'Le serveur met trop de temps à répondre, veuillez réessayer'
          : 'Impossible de joindre le serveur, veuillez réessayer';
      const erreur = new Error(corps?.error ?? parDefaut);
      erreur.status = error.response?.status;
      erreur.details = corps?.details;
      return Promise.reject(erreur);
    },
  );

  return client;
};
