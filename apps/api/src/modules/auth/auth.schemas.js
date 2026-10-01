import { z } from 'zod';
import { email, password } from '../../shared/http/schemas.js';

export const registerBody = z.object({
  email,
  password,
  name: z.string({ error: 'Le nom est requis' }).trim().min(1, { error: 'Le nom est requis' }).max(50, { error: 'Le nom est trop long' }),
});

export const loginBody = z.object({
  email: z.string({ error: "L'email est requis" }).trim(),
  password: z.string({ error: 'Le mot de passe est requis' }),
});

export const requestResetBody = z.object({ email });

export const tokenBody = z.object({
  token: z.string({ error: 'Lien invalide ou expiré' }).min(1, { error: 'Lien invalide ou expiré' }),
});

export const resetPasswordBody = tokenBody
  .extend({ newPassword: password, confirmPassword: z.string() })
  .refine((body) => body.newPassword === body.confirmPassword, {
    error: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });
