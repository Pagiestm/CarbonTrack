import { prisma } from '../../shared/db/prisma.js';
import { badRequest, notFound } from '../../shared/http/errors.js';
import { computeFootprint } from './footprint.js';
import { page, rechercheSur, toSkipTake } from '../../shared/http/pagination.js';

const avecNombreDeLignes = { _count: { select: { ProjectMaterial: true } } };

async function listerProjets(where, options) {
  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      select: { ...projectListSelect, ...avecNombreDeLignes },
      orderBy: { createdAt: 'desc' },
      ...toSkipTake(options),
    }),
    prisma.project.count({ where }),
  ]);
  return page(items, total, options);
}

export function listProjects(userId, options) {
  return listerProjets(
    { userId, ...rechercheSur(['name', 'description', 'location'], options.search) },
    options,
  );
}

export function listAllProjects(options) {
  return listerProjets(rechercheSur(['name', 'description', 'location'], options.search), options);
}

const projectListSelect = {
  id: true,
  name: true,
  description: true,
  totalFootprint: true,
  userId: true,
  createdAt: true,
  location: true,
  surface: true,
  kind: true,
  status: true,
  startDate: true,
};

export async function getProject(id, userId) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { ProjectMaterial: { include: { material: true } } },
  });
  if (!project || project.userId !== userId) {
    throw notFound('Projet introuvable');
  }
  return project;
}

export async function createProject(userId, { materials, ...contexte }) {
  const totalFootprint = await footprintOf(materials);

  return prisma.project.create({
    data: {
      ...contexte,
      totalFootprint,
      userId,
      ProjectMaterial: {
        create: materials.map(({ materialId, quantity }) => ({ materialId, quantity })),
      },
    },
    include: { ProjectMaterial: true },
  });
}

export async function updateProject(id, userId, { materials, ...contexte }) {
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
    prisma.project.update({ where: { id }, data: { ...contexte, totalFootprint } }),
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

async function footprintOf(lines) {
  const ids = lines.map((line) => line.materialId);
  const found = await prisma.material.findMany({
    where: { id: { in: ids } },
    select: { id: true, carbonFootprint: true },
  });
  const byId = new Map(found.map((material) => [material.id, material]));

  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length) {
    throw badRequest(`Matériau introuvable : ${missing.join(', ')}`);
  }

  return computeFootprint(
    lines.map((line) => ({
      quantity: line.quantity,
      carbonFootprint: byId.get(line.materialId).carbonFootprint,
    })),
  );
}
