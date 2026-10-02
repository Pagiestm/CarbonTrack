import { z } from 'zod';
import { email, password } from '../../shared/http/schemas.js';
import { ROLES } from '../../shared/http/enums.js';

const texteFacultatif = (max, nom) =>
  z
    .string()
    .trim()
    .max(max, { error: `${nom} est trop long` })
    .nullish();

export const updateProfileBody = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(1, { error: 'Le nom est requis' })
      .max(50, { error: 'Le nom est trop long' })
      .optional(),
    email: email.optional(),
    company: texteFacultatif(100, "Le nom de l'entreprise"),
    jobTitle: texteFacultatif(80, 'La fonction'),
    phone: texteFacultatif(30, 'Le téléphone'),
    city: texteFacultatif(100, 'La ville'),
  },
  {
    error: (issue) =>
      issue.code === 'unrecognized_keys'
        ? `Champs non modifiables : ${issue.keys.join(', ')}`
        : undefined,
  },
);

export const changePasswordBody = z
  .object({
    currentPassword: z.string({ error: 'Le mot de passe actuel est requis' }).min(1, {
      error: 'Le mot de passe actuel est requis',
    }),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((body) => body.newPassword === body.confirmPassword, {
    error: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const changeRoleBody = z.object({
  role: z.enum(ROLES, { error: 'Rôle inconnu' }),
});
