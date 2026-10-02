import { describe, expect, it, vi } from 'vitest';
import {
  CreateProject,
  EstimateFootprint,
  ListProjects,
  UpdateProject,
} from '@/domain/use-cases/projects/index.js';
import { fauxDepot, unMateriau, unePage, unProjet } from '../helpers/doubles.js';

describe('CreateProject', () => {
  it('normalise les lignes avant de les transmettre', async () => {
    const projectRepository = fauxDepot({ create: vi.fn().mockResolvedValue(unProjet()) });

    await new CreateProject({ projectRepository }).execute({
      name: 'P',
      materials: [
        { materialId: '3', quantity: '2.5' },
        { materialId: '', quantity: '9' },
        { materialId: '4', quantity: '0' },
      ],
    });

    expect(projectRepository.create).toHaveBeenCalledWith({
      name: 'P',
      materials: [{ materialId: 3, quantity: 2.5 }],
    });
  });

  it('transmet le contexte du chantier tel quel', async () => {
    const projectRepository = fauxDepot({ create: vi.fn().mockResolvedValue(unProjet()) });

    await new CreateProject({ projectRepository }).execute({
      name: 'P',
      location: 'Nantes',
      surface: 40,
      kind: 'EXTENSION',
      materials: [{ materialId: 1, quantity: 1 }],
    });

    expect(projectRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ location: 'Nantes', surface: 40, kind: 'EXTENSION' }),
    );
  });

  it('refuse un projet sans aucune ligne utilisable', async () => {
    const cas = new CreateProject({ projectRepository: fauxDepot() });
    await expect(
      cas.execute({ name: 'P', materials: [{ materialId: '', quantity: '' }] }),
    ).rejects.toThrow(/au moins un matériau/);
  });

  it('refuse deux fois le même matériau', async () => {
    const cas = new CreateProject({ projectRepository: fauxDepot() });
    await expect(
      cas.execute({
        name: 'P',
        materials: [
          { materialId: 1, quantity: 1 },
          { materialId: 1, quantity: 2 },
        ],
      }),
    ).rejects.toThrow(/qu'une fois/);
  });

  it("rejette au lieu de lever : l'appelant n'a qu'un comportement à gérer", () => {
    const cas = new CreateProject({ projectRepository: fauxDepot() });
    expect(() => cas.execute({ name: 'P', materials: [] })).not.toThrow();
  });
});

describe('UpdateProject', () => {
  it('applique les mêmes règles que la création', async () => {
    const cas = new UpdateProject({ projectRepository: fauxDepot() });
    await expect(cas.execute(1, { name: 'P', materials: [] })).rejects.toThrow(
      /au moins un matériau/,
    );
  });
});

describe('ListProjects', () => {
  it('transmet les options de pagination au dépôt', async () => {
    const projectRepository = fauxDepot({ list: vi.fn().mockResolvedValue(unePage([])) });
    await new ListProjects({ projectRepository }).execute({ page: 3, perPage: 9, search: 'bois' });
    expect(projectRepository.list).toHaveBeenCalledWith({ page: 3, perPage: 9, search: 'bois' });
  });
});

describe('EstimateFootprint', () => {
  const catalogue = new Map([
    [1, unMateriau({ id: 1, carbonFootprint: 10 })],
    [2, unMateriau({ id: 2, carbonFootprint: 2.5 })],
  ]);

  it('additionne les lignes à partir du catalogue, sans réseau', () => {
    const total = new EstimateFootprint().execute(
      [
        { materialId: 1, quantity: 3 },
        { materialId: 2, quantity: 4 },
      ],
      catalogue,
    );
    expect(total.kg).toBe(40);
  });

  it('ignore les lignes incomplètes et les matériaux inconnus', () => {
    const total = new EstimateFootprint().execute(
      [
        { materialId: 1, quantity: 3 },
        { materialId: 99, quantity: 5 },
        { materialId: 1, quantity: 0 },
        { materialId: '', quantity: 7 },
      ],
      catalogue,
    );
    expect(total.kg).toBe(30);
  });

  it('vaut zéro sans aucune ligne', () => {
    expect(new EstimateFootprint().execute([], catalogue).kg).toBe(0);
  });
});
