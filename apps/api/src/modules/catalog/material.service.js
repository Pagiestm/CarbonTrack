import { prisma } from '../../shared/db/prisma.js';
import { badRequest, conflict, notFound, surLeChamp } from '../../shared/http/errors.js';
import { page, rechercheSur, toSkipTake } from '../../shared/http/pagination.js';

const avecCategorie = { include: { category: { select: { id: true, name: true } } } };

export function countMaterials() {
  return prisma.material.count();
}

export async function listMaterials(options) {
  const where = rechercheSur(['name', 'supplier'], options.search);

  if (options.all) {
    const items = await prisma.material.findMany({
      where,
      ...avecCategorie,
      orderBy: { name: 'asc' },
    });
    return page(items, items.length, { page: 1, perPage: items.length || 1 });
  }

  const [items, total] = await prisma.$transaction([
    prisma.material.findMany({
      where,
      ...avecCategorie,
      orderBy: { name: 'asc' },
      ...toSkipTake(options),
    }),
    prisma.material.count({ where }),
  ]);
  return page(items, total, options);
}

export async function getMaterial(id) {
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) {
    throw notFound('Matériau introuvable');
  }
  return material;
}

export async function createMaterial(data) {
  await assertCategoryExists(data.categoryId);
  return prisma.material.create({ data });
}

export async function updateMaterial(id, data) {
  await getMaterial(id);
  if (data.categoryId !== undefined) {
    await assertCategoryExists(data.categoryId);
  }
  return prisma.material.update({ where: { id }, data });
}

export async function deleteMaterial(id) {
  await getMaterial(id);
  const used = await prisma.projectMaterial.count({ where: { materialId: id } });
  if (used) {
    throw conflict(
      `Matériau utilisé dans ${used} projet${used > 1 ? 's' : ''} : impossible de le supprimer`,
    );
  }
  await prisma.material.delete({ where: { id } });
}

async function assertCategoryExists(categoryId) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    throw badRequest('Catégorie introuvable', surLeChamp('categoryId', 'Catégorie introuvable'));
  }
}
