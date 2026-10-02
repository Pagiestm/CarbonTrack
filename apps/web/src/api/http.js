import axios from 'axios';
import { getToken } from '@/shared/auth/session';

// Client HTTP unique : ajoute le jeton de session et transforme les erreurs
// en Error portant le message de l'API ({ error }).
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  const session = getToken();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
    const apiError = new Error(
      body?.error ?? 'Impossible de joindre le serveur, veuillez réessayer',
    );
    apiError.status = error.response?.status;
    apiError.details = body?.details;
    return Promise.reject(apiError);
  },
);
