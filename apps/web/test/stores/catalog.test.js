import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { Category } from '@/domain/entities/Category.js';
import { unMateriau, unePage } from '../helpers/doubles.js';

const casDUsage = {
  catalog: {
    listAllMaterials: { execute: vi.fn() },
    listCategories: { execute: vi.fn() },
  },
};

vi.mock('@/container.js', () => ({ useCases: casDUsage }));

const { useCatalogStore } = await import('@/presentation/stores/catalog.js');

describe('store du catalogue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('charge matériaux et catégories', async () => {
    casDUsage.catalog.listAllMaterials.execute.mockResolvedValue(unePage([unMateriau()]));
    casDUsage.catalog.listCategories.execute.mockResolvedValue([
      new Category({ id: 1, name: 'Gros œuvre' }),
    ]);

    const store = useCatalogStore();
    await store.charger();

    expect(store.materiaux).toHaveLength(1);
    expect(store.categories).toHaveLength(1);
    expect(store.materiauxParId.get(1).name).toBe('Béton C25/30');
  });

  it('recolle la catégorie absente de la réponse', async () => {
    casDUsage.catalog.listAllMaterials.execute.mockResolvedValue(
      unePage([unMateriau({ categoryId: 2, category: null })]),
    );
    casDUsage.catalog.listCategories.execute.mockResolvedValue([
      new Category({ id: 2, name: 'Isolation' }),
    ]);

    const store = useCatalogStore();
    await store.charger();

    expect(store.materiaux[0].category.name).toBe('Isolation');
  });

  it('ne recharge pas si le catalogue est déjà là', async () => {
    casDUsage.catalog.listAllMaterials.execute.mockResolvedValue(unePage([unMateriau()]));
    casDUsage.catalog.listCategories.execute.mockResolvedValue([]);

    const store = useCatalogStore();
    await store.charger();
    await store.charger();

    expect(casDUsage.catalog.listAllMaterials.execute).toHaveBeenCalledTimes(1);
  });

  it('recharge quand on le force', async () => {
    casDUsage.catalog.listAllMaterials.execute.mockResolvedValue(unePage([unMateriau()]));
    casDUsage.catalog.listCategories.execute.mockResolvedValue([]);

    const store = useCatalogStore();
    await store.charger();
    await store.charger({ force: true });

    expect(casDUsage.catalog.listAllMaterials.execute).toHaveBeenCalledTimes(2);
  });

  it('retient l’erreur sans planter', async () => {
    casDUsage.catalog.listAllMaterials.execute.mockRejectedValue(new Error('API injoignable'));
    casDUsage.catalog.listCategories.execute.mockResolvedValue([]);

    const store = useCatalogStore();
    await store.charger();

    expect(store.erreur).toBe('API injoignable');
    expect(store.chargement).toBe(false);
  });
});
