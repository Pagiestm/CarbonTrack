import { describe, expect, it } from 'vitest';
import { listQuery, page, rechercheSur, toSkipTake } from '../../src/shared/http/pagination.js';

describe('listQuery', () => {
  it('applique des valeurs par défaut raisonnables', () => {
    expect(listQuery.parse({})).toEqual({ page: 1, perPage: 12 });
  });

  it('convertit les chaînes de la query string', () => {
    const { page: numero, perPage } = listQuery.parse({ page: '3', perPage: '25' });
    expect(numero).toBe(3);
    expect(perPage).toBe(25);
  });

  it('plafonne la taille de page à 100', () => {
    expect(listQuery.safeParse({ perPage: '101' }).success).toBe(false);
    expect(listQuery.safeParse({ perPage: '100' }).success).toBe(true);
  });

  it('refuse une page nulle ou négative', () => {
    expect(listQuery.safeParse({ page: '0' }).success).toBe(false);
    expect(listQuery.safeParse({ page: '-1' }).success).toBe(false);
  });

  it('détoure la recherche et la plafonne', () => {
    expect(listQuery.parse({ search: '  bois  ' }).search).toBe('bois');
    expect(listQuery.safeParse({ search: 'x'.repeat(101) }).success).toBe(false);
  });

  it('accepte all=true pour les listes bornées', () => {
    expect(listQuery.parse({ all: 'true' }).all).toBe(true);
    expect(listQuery.parse({ all: 'false' }).all).toBe(false);
  });
});

describe('toSkipTake', () => {
  it('traduit page et taille en skip/take', () => {
    expect(toSkipTake({ page: 1, perPage: 12 })).toEqual({ skip: 0, take: 12 });
    expect(toSkipTake({ page: 3, perPage: 20 })).toEqual({ skip: 40, take: 20 });
  });
});

describe('page', () => {
  it('calcule le nombre de pages', () => {
    expect(page([], 69, { page: 1, perPage: 12 }).pageCount).toBe(6);
    expect(page([], 72, { page: 1, perPage: 12 }).pageCount).toBe(6);
    expect(page([], 73, { page: 1, perPage: 12 }).pageCount).toBe(7);
  });

  it('garde au moins une page même sans résultat', () => {
    expect(page([], 0, { page: 1, perPage: 12 }).pageCount).toBe(1);
  });
});

describe('rechercheSur', () => {
  it('construit un OU insensible à la casse', () => {
    expect(rechercheSur(['name', 'supplier'], 'bois')).toEqual({
      OR: [
        { name: { contains: 'bois', mode: 'insensitive' } },
        { supplier: { contains: 'bois', mode: 'insensitive' } },
      ],
    });
  });

  it('ne filtre rien sans terme', () => {
    expect(rechercheSur(['name'], undefined)).toEqual({});
    expect(rechercheSur(['name'], '')).toEqual({});
  });
});
