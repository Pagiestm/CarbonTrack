// Champs d'un utilisateur renvoyés par l'API : jamais le hash du mot de passe.
export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  googleId: true,
  createdAt: true,
};
