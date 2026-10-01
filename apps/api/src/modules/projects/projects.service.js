import { prisma } from '../../shared/db/prisma.js';
import { badRequest, notFound } from '../../shared/http/errors.js';
import { computeFootprint } from './footprint.js';

export function listProjects(userId) {
  return prisma.project.findMany({ where: { userId }, orderBy: { id: 'asc' } });
}

export function listAllProjects() {
  return prisma.project.findMany({ orderBy: { id: 'asc' } });
}

export async function getProject(id, userId) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { ProjectMaterial: { include: { material: true } } },
  });
  // Le projet d'un autre utilisateur est traité comme inexistant.
  if (!project || project.userId !== userId) {
    throw notFound('Projet introuvable');
  }
  return project;
}

export async function createProject(userId, { name, description, materials }) {
  const totalFootprint = await footprintOf(materials);

  return prisma.project.create({
    data: {
      name,
      description,
      totalFootprint,
      userId,
      ProjectMaterial: { create: materials.map(({ materialId, quantity }) => ({ materialId, quantity })) },
    },
    include: { ProjectMaterial: true },
  });
}

// Remplace la liste des matériaux du projet par celle reçue, et recalcule
// l'empreinte, en une seule transaction.
export async function updateProject(id, userId, { name, description, materials }) {
  await assertOwner(id, userId);
  const totalFootprint = await footprintOf(materials);

  const results = await prisma.$transaction([
    prisma.projectMaterial.deleteMany({
      where: { projectId: id, materialId: { notIn: materials.map((line) => line.materialId) } },
    }),
    ...materials.map(({ materialId, quantity }) =>
      prisma.projectMaterial.upsert({
        where: { projectId_materialId: { projectId: id, materialId } },
        update: { quantity },
        create: { projectId: id, materialId, quantity },
      }),
    ),
    prisma.project.update({ where: { id }, data: { name, description, totalFootprint } }),
  ]);

  return results.at(-1);
}

export async function deleteProject(id, userId) {
  await assertOwner(id, userId);
  await prisma.$transaction([
    prisma.projectMaterial.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);
}

async function assertOwner(id, userId) {
  const project = await prisma.project.findUnique({ where: { id }, select: { userId: true } });
  if (!project || project.userId !== userId) {
    throw notFound('Projet introuvable');
  }
}

// Calcule l'empreinte à partir des matériaux en base ; refuse un matériau inconnu.
async function footprintOf(lines) {
  const ids = lines.map((line) => line.materialId);
  const found = await prisma.material.findMany({ where: { id: { in: ids } }, select: { id: true, carbonFootprint: true } });
  const byId = new Map(found.map((material) => [material.id, material]));

  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length) {
    throw badRequest(`Matériau introuvable : ${missing.join(', ')}`);
  }

  return computeFootprint(lines.map((line) => ({ quantity: line.quantity, carbonFootprint: byId.get(line.materialId).carbonFootprint })));
}
