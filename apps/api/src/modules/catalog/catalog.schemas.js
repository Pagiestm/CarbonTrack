import { z } from 'zod';

const text = (label, max) =>
  z
    .string({ error: `${label} est requis` })
    .trim()
    .min(1, { error: `${label} est requis` })
    .max(max, { error: `${label} ne doit pas dépasser ${max} caractères` });

const positiveNumber = (label) =>
  z.coerce
    .number({ error: `${label} doit être un nombre` })
    .min(0, { error: `${label} doit être positif` });

export const categoryBody = z.object({
  name: text('Le nom', 100),
});

export const materialBody = z.object({
  name: text('Le nom', 50),
  supplier: text('Le fournisseur', 50),
  carbonFootprint: positiveNumber("L'empreinte carbone"),
  unit: text("L'unité", 50),
  pricePerUnit: positiveNumber('Le prix par unité'),
  categoryId: z.coerce
    .number({ error: 'La catégorie est requise' })
    .int()
    .positive({ error: 'La catégorie est requise' }),
});

export const materialUpdateBody = materialBody.partial();
