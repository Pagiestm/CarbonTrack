import { prisma } from '../../shared/db/prisma.js';
import { badRequest, conflict, notFound } from '../../shared/http/errors.js';

export function listMaterials() {
  return prisma.material.findMany({ orderBy: { id: 'asc' } });
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
    throw conflict(`Matériau utilisé dans ${used} projet${used > 1 ? 's' : ''} : impossible de le supprimer`);
  }
  await prisma.material.delete({ where: { id } });
}

async function assertCategoryExists(categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) {
    throw badRequest('Catégorie introuvable');
  }
}
