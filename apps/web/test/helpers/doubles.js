import { vi } from 'vitest';
import { Category } from '@/domain/entities/Category.js';
import { Material } from '@/domain/entities/Material.js';
import { Page } from '@/domain/entities/Page.js';
import { Project, ProjectLine } from '@/domain/entities/Project.js';
import { User } from '@/domain/entities/User.js';

export const unMateriau = (champs = {}) =>
  new Material({
    id: 1,
    name: 'Béton C25/30',
    supplier: 'Lafarge',
    carbonFootprint: 245.5,
    unit: 'm³',
    pricePerUnit: 120,
    categoryId: 1,
    category: new Category({ id: 1, name: 'Gros œuvre' }),
    ...champs,
  });

export const uneLigne = (champs = {}) =>
  new ProjectLine({ materialId: 1, quantity: 2, material: unMateriau(), ...champs });

export const unProjet = (champs = {}) =>
  new Project({
    id: 1,
    name: 'Extension ossature bois',
    description: 'Extension sur dalle béton',
    totalFootprint: 491,
    userId: 1,
    createdAt: '2026-05-12T10:00:00.000Z',
    surface: 40,
    kind: 'EXTENSION',
    status: 'IN_PROGRESS',
    location: 'Nantes',
    lines: [uneLigne()],
    ...champs,
  });

export const unUtilisateur = (champs = {}) =>
  new User({
    id: 1,
    email: 'marie.durand@example.fr',
    name: 'Marie Durand',
    role: 'USER',
    createdAt: '2026-01-10T09:00:00.000Z',
    ...champs,
  });

export const unePage = (items, champs = {}) =>
  new Page({ items, total: items.length, page: 1, perPage: 12, pageCount: 1, ...champs });

export const fauxDepot = (methodes = {}) =>
  new Proxy(
    {},
    {
      get(cible, propriete) {
        if (propriete in methodes) return methodes[propriete];
        cible[propriete] ??= vi.fn().mockResolvedValue(undefined);
        return cible[propriete];
      },
    },
  );
