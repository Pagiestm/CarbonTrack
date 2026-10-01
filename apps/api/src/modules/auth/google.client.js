import { env } from '../../config/env.js';

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export function googleAuthUrl() {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: env.GOOGLE_REDIRECT_URI ?? '',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });
  return `${AUTH_URL}?${params}`;
}

// Échange le code d'autorisation contre le profil Google de l'utilisateur.
export async function fetchGoogleProfile(code) {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID ?? '',
      client_secret: env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: env.GOOGLE_REDIRECT_URI ?? '',
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error(`Google a refusé le code d'autorisation (${tokenResponse.status})`);
  }
  const { access_token } = await tokenResponse.json();

  const profileResponse = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileResponse.ok) {
    throw new Error(`Profil Google inaccessible (${profileResponse.status})`);
  }
  const { email, name, id } = await profileResponse.json();
  return { email, name, googleId: id };
}
