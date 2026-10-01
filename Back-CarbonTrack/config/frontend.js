// Adresse du client, pour les redirections et les liens envoyés par email.
export const frontendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;
