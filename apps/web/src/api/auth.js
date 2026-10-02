import { http } from './http';

// Module auth de l'API : /auth et /password-reset

export const registerUser = async (userData) => (await http.post('/auth/register', userData)).data;

export const loginUser = async (credentials) => (await http.post('/auth/login', credentials)).data;

// La connexion Google se fait par redirection : l'API renvoie ensuite vers
// le client avec ?token=… dans l'URL.
export const googleAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

export const requestPasswordReset = async (email) =>
  (await http.post('/password-reset/request-password-reset', { email })).data;

export const resetPassword = async (token, newPassword, confirmPassword) =>
  (await http.post('/password-reset/reset-password', { token, newPassword, confirmPassword })).data;

export const checkToken = async (token) =>
  (await http.post('/password-reset/check-token', { token })).data;
