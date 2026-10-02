import { z } from 'zod';

const materialLine = z.object({
  materialId: z.coerce
    .number({ error: 'Matériau invalide' })
    .int()
    .positive({ error: 'Matériau invalide' }),
  quantity: z.coerce
    .number({ error: 'La quantité doit être un nombre' })
    .positive({ error: 'La quantité doit être positive' }),
});

// totalFootprint et userId, que le client envoie parfois, sont ignorés :
// l'empreinte est recalculée et le propriétaire vient du jeton.
export const projectBody = z.object({
  name: z
    .string({ error: 'Le nom est requis' })
    .trim()
    .min(1, { error: 'Le nom est requis' })
    .max(100, { error: 'Le nom ne doit pas dépasser 100 caractères' }),
  description: z.string().trim().nullish(),
  materials: z
    .array(materialLine)
    .default([])
    .refine((lines) => new Set(lines.map((line) => line.materialId)).size === lines.length, {
      error: 'Un même matériau apparaît plusieurs fois',
    }),
});
