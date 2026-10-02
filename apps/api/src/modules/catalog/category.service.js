import { prisma } from '../../shared/db/prisma.js';
import { conflict, notFound } from '../../shared/http/errors.js';

export function listCategories() {
  return prisma.category.findMany({ orderBy: { id: 'asc' } });
}

// Catégories qui ont au moins un matériau, avec leurs matériaux.
export function listCategoriesWithMaterials() {
  return prisma.category.findMany({
    where: { Materials: { some: {} } },
    include: { Materials: { orderBy: { id: 'asc' } } },
    orderBy: { id: 'asc' },
  });
}

export function createCategory(data) {
  return prisma.category.create({ data });
}

export async function updateCategory(id, data) {
  await findCategory(id);
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id) {
  await findCategory(id);
  const used = await prisma.material.count({ where: { categoryId: id } });
  if (used) {
    throw conflict(
      `Catégorie utilisée par ${used} matériau${used > 1 ? 'x' : ''} : supprimez-les ou déplacez-les d'abord`,
    );
  }
  await prisma.category.delete({ where: { id } });
}

async function findCategory(id) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw notFound('Catégorie introuvable');
  }
  return category;
}
