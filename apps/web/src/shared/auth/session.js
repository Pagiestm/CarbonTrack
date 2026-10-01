// Session de l'utilisateur : le jeton JWT renvoyé par l'API, gardé dans le
// localStorage. Son contenu (role, exp) est lu côté client pour l'affichage
// et le routage ; l'API, elle, le vérifie à chaque requête.
const TOKEN_KEY = 'authToken';

const decode = (token) => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(json);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  let decodedToken;
  try {
    decodedToken = decode(token);
  } catch {
    clearSession();
    return null;
  }

  if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
    return { token: null, decodedToken: null, expired: true };
  }
  return { token, decodedToken, expired: false };
};

export const isAuthenticated = () => {
  const session = getToken();
  return Boolean(session && !session.expired);
};

export const isAdmin = () => getToken()?.decodedToken?.role === 'ADMIN';

export const saveSession = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('role'); // clé des anciennes versions du client
};
