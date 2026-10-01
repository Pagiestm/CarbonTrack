import { prisma } from '../../shared/db/prisma.js';
import { conflict, notFound } from '../../shared/http/errors.js';
import { publicUserSelect } from './users.select.js';

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) {
    throw notFound('Utilisateur introuvable');
  }
  return user;
}

export function listUsers() {
  return prisma.user.findMany({ select: publicUserSelect, orderBy: { id: 'asc' } });
}

export async function updateProfile(userId, { name, email }) {
  if (email) {
    const owner = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (owner && owner.id !== userId) {
      throw conflict('Un compte existe déjà avec cet email');
    }
  }
  return prisma.user.update({ where: { id: userId }, data: { name, email }, select: publicUserSelect });
}

// Supprime le compte et tout ce qui lui appartient.
export async function deleteAccount(userId) {
  await prisma.$transaction([
    prisma.projectMaterial.deleteMany({ where: { project: { userId } } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}
