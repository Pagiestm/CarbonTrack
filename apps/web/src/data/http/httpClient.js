import axios from 'axios';

export const createHttpClient = ({ baseURL, getToken }) => {
  const client = axios.create({ baseURL, headers: { Accept: 'application/json' } });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

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
