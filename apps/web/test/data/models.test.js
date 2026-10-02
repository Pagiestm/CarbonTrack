import { describe, expect, it } from 'vitest';
import {
  toCategory,
  toMaterial,
  toPage,
  toProject,
  toSession,
  toUser,
} from '@/data/models/index.js';

describe('toMaterial', () => {
  it('convertit les décimaux renvoyés en texte par Prisma', () => {
    const materiau = toMaterial({
      id: 1,
      name: 'Béton',
      carbonFootprint: '245.5',
      pricePerUnit: '120',
      unit: 'm³',
      categoryId: 1,
    });
    expect(materiau.carbonFootprint).toBe(245.5);
    expect(materiau.pricePerUnit).toBe(120);
    expect(materiau.footprintFor(2).kg).toBe(491);
  });

  it('accepte une catégorie absente', () => {
    expect(toMaterial({ id: 1, carbonFootprint: 1, pricePerUnit: 1 }).category).toBeNull();
  });
});

describe('toCategory', () => {
  it('lit les matériaux sous Materials, en PascalCase', () => {
    const categorie = toCategory({
      id: 1,
      name: 'Isolation',
      Materials: [{ id: 2, carbonFootprint: '1', pricePerUnit: '1' }],
    });
    expect(categorie.materials).toHaveLength(1);
    expect(categorie.materials[0].id).toBe(2);
  });
});

describe('toProject', () => {
  it('lit les lignes sous ProjectMaterial', () => {
    const projet = toProject({
      id: 1,
      name: 'P',
      totalFootprint: '491',
      userId: 1,
      ProjectMaterial: [
        {
          materialId: 1,
          quantity: 2,
          material: { id: 1, carbonFootprint: '245.5', pricePerUnit: '0' },
        },
      ],
    });
    expect(projet.lines).toHaveLength(1);
    expect(projet.lines[0].footprint.kg).toBe(491);
  });

  it('lit le nombre de lignes sous _count quand la liste est absente', () => {
    const vignette = toProject({
      id: 1,
      name: 'P',
      totalFootprint: '0',
      userId: 1,
      _count: { ProjectMaterial: 5 },
    });
    expect(vignette.lines).toEqual([]);
    expect(vignette.lineCount).toBe(5);
  });
});

describe('toUser', () => {
  it('lit le nombre de projets sous _count', () => {
    const compte = toUser({
      id: 1,
      name: 'A',
      email: 'a@b.fr',
      role: 'USER',
      _count: { Projects: 3 },
    });
    expect(compte.projectCount).toBe(3);
  });
});

describe('toSession', () => {
  it('décode la charge utile du jeton', () => {
    const charge = { userId: 42, role: 'ADMIN', exp: 2_000_000_000 };
    const base64 = btoa(JSON.stringify(charge)).replace(/\+/g, '-').replace(/\//g, '_');
    const jeton = `entete.${base64}.signature`;

    const session = toSession(jeton);
    expect(session.userId).toBe(42);
    expect(session.isAdmin).toBe(true);
    expect(session.expiresAt).toBe(2_000_000_000 * 1000);
  });

  it('rejette un jeton illisible', () => {
    expect(() => toSession('pas-un-jeton')).toThrow();
  });
});

describe('toPage', () => {
  it('enveloppe la réponse paginée en transformant chaque élément', () => {
    const page = toPage(
      {
        items: [{ id: 1, name: 'A', email: 'a@b.fr', role: 'USER' }],
        total: 30,
        page: 2,
        perPage: 12,
        pageCount: 3,
      },
      toUser,
    );
    expect(page.items[0].name).toBe('A');
    expect(page.total).toBe(30);
    expect(page.from).toBe(13);
  });

  it('supporte une réponse sans items', () => {
    expect(toPage({ total: 0 }, toUser).items).toEqual([]);
  });
});
