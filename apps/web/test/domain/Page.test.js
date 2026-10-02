import { describe, expect, it } from 'vitest';
import { Page } from '@/domain/entities/Page.js';

describe('Page', () => {
  it('sait se dire vide', () => {
    expect(Page.vide().isEmpty).toBe(true);
    expect(new Page({ items: [1], total: 1 }).isEmpty).toBe(false);
  });

  it('calcule les bornes affichées', () => {
    const page = new Page({ items: [], total: 69, page: 2, perPage: 12, pageCount: 6 });
    expect(page.from).toBe(13);
    expect(page.to).toBe(24);
  });

  it('borne la fin au total sur la dernière page', () => {
    const page = new Page({ items: [], total: 69, page: 6, perPage: 12, pageCount: 6 });
    expect(page.to).toBe(69);
  });

  it('affiche 0 quand il n’y a rien', () => {
    expect(Page.vide().from).toBe(0);
  });
});
