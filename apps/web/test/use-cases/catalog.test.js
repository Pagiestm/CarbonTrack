import { describe, expect, it, vi } from 'vitest';
import { CountMaterials } from '@/domain/use-cases/catalog/index.js';
import { fauxDepot } from '../helpers/doubles.js';

describe('CountMaterials', () => {
  it('renvoie le nombre de matériaux du catalogue', async () => {
    const catalogRepository = fauxDepot({ countMaterials: vi.fn().mockResolvedValue(56) });

    await expect(new CountMaterials({ catalogRepository }).execute()).resolves.toBe(56);
  });
});
