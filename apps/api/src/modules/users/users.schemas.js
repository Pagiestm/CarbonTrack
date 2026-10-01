import { z } from 'zod';
import { email } from '../../shared/http/schemas.js';

// Seuls le nom et l'email sont modifiables : toute autre clé (role…) est refusée.
export const updateProfileBody = z.strictObject(
  {
    name: z.string().trim().min(1, { error: 'Le nom est requis' }).max(50, { error: 'Le nom est trop long' }).optional(),
    email: email.optional(),
  },
  { error: (issue) => (issue.code === 'unrecognized_keys' ? `Champs non modifiables : ${issue.keys.join(', ')}` : undefined) },
);
