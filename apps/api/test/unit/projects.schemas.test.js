import { describe, expect, it } from 'vitest';
import { projectBody } from '../../src/modules/projects/projects.schemas.js';

const base = { name: 'Extension', materials: [{ materialId: 1, quantity: 2 }] };

describe('projectBody', () => {
  it('se contente du nom et des matériaux', () => {
    const resultat = projectBody.parse(base);
    expect(resultat.kind).toBe('NEUF');
    expect(resultat.status).toBe('DRAFT');
  });

  it('accepte le contexte du chantier', () => {
    const resultat = projectBody.parse({
      ...base,
      location: 'Nantes',
      surface: '120.5',
      kind: 'RENOVATION',
      status: 'IN_PROGRESS',
      startDate: '2026-03-01',
    });
    expect(resultat.surface).toBe(120.5);
    expect(resultat.kind).toBe('RENOVATION');
    expect(resultat.startDate).toBeInstanceOf(Date);
  });

  it('refuse un type ou un statut inconnu', () => {
    expect(projectBody.safeParse({ ...base, kind: 'CHATEAU' }).success).toBe(false);
    expect(projectBody.safeParse({ ...base, status: 'PEUT_ETRE' }).success).toBe(false);
  });

  it('refuse une surface négative ou irréaliste', () => {
    expect(projectBody.safeParse({ ...base, surface: -1 }).success).toBe(false);
    expect(projectBody.safeParse({ ...base, surface: 2_000_000 }).success).toBe(false);
  });

  it('refuse deux fois le même matériau', () => {
    const resultat = projectBody.safeParse({
      ...base,
      materials: [
        { materialId: 1, quantity: 1 },
        { materialId: 1, quantity: 2 },
      ],
    });
    expect(resultat.success).toBe(false);
  });
});
