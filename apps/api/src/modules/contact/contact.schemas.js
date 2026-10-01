import { z } from 'zod';
import { email } from '../../shared/http/schemas.js';

const required = (max) =>
  z
    .string({ error: 'Tous les champs sont obligatoires' })
    .trim()
    .min(1, { error: 'Tous les champs sont obligatoires' })
    .max(max, { error: `Ce champ ne doit pas dépasser ${max} caractères` });

export const contactBody = z.object({
  name: required(100),
  email,
  message: required(5000),
});
