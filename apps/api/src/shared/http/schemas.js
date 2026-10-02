import { z } from 'zod';

export const idParams = z.object({
  id: z.coerce
    .number({ error: 'Identifiant invalide' })
    .int()
    .positive({ error: 'Identifiant invalide' }),
});

// Normalisé en minuscules : PostgreSQL compare en respectant la casse, et
// sans ça « Jean@example.com » et « jean@example.com » feraient deux comptes.
export const email = z
  .string({ error: "L'email est requis" })
  .trim()
  .toLowerCase()
  .max(100, { error: "L'email est trop long" })
  .pipe(z.email({ error: "Format d'email invalide" }));

// Au moins 8 caractères, une minuscule, une majuscule, un chiffre et un symbole.
export const password = z
  .string({ error: 'Le mot de passe est requis' })
  .max(100, { error: 'Le mot de passe est trop long' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/, {
    error:
      'Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule, un chiffre et un symbole',
  });
