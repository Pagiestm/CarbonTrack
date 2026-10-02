import { z } from 'zod';

export const listQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().trim().max(100).optional(),
  all: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export const toSkipTake = ({ page, perPage }) => ({
  skip: (page - 1) * perPage,
  take: perPage,
});

export const page = (items, total, { page: numero, perPage }) => ({
  items,
  total,
  page: numero,
  perPage,
  pageCount: Math.max(1, Math.ceil(total / perPage)),
});

export const rechercheSur = (champs, terme) =>
  terme
    ? { OR: champs.map((champ) => ({ [champ]: { contains: terme, mode: 'insensitive' } })) }
    : {};
