import { z } from 'zod';
import { PROJECT_KINDS, PROJECT_STATUSES } from '../../shared/http/enums.js';

const materialLine = z.object({
  materialId: z.coerce
    .number({ error: 'Matériau invalide' })
    .int()
    .positive({ error: 'Matériau invalide' }),
  quantity: z.coerce
    .number({ error: 'La quantité doit être un nombre' })
    .positive({ error: 'La quantité doit être positive' }),
});

export const projectBody = z.object({
  name: z
    .string({ error: 'Le nom est requis' })
    .trim()
    .min(1, { error: 'Le nom est requis' })
    .max(100, { error: 'Le nom ne doit pas dépasser 100 caractères' }),
  description: z.string().trim().nullish(),

  location: z.string().trim().max(100, { error: 'Le lieu est trop long' }).nullish(),
  surface: z.coerce
    .number({ error: 'La surface doit être un nombre' })
    .positive({ error: 'La surface doit être positive' })
    .max(1_000_000, { error: 'La surface est irréaliste' })
    .nullish(),
  kind: z.enum(PROJECT_KINDS, { error: 'Type de projet inconnu' }).default('NEUF'),
  status: z.enum(PROJECT_STATUSES, { error: 'Statut inconnu' }).default('DRAFT'),
  startDate: z.coerce.date({ error: 'Date invalide' }).nullish(),

  materials: z
    .array(materialLine)
    .default([])
    .refine((lines) => new Set(lines.map((line) => line.materialId)).size === lines.length, {
      error: 'Un même matériau apparaît plusieurs fois',
    }),
});
