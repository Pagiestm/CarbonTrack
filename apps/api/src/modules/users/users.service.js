import bcrypt from 'bcryptjs';
import { prisma } from '../../shared/db/prisma.js';
import { badRequest, conflict, notFound, surLeChamp } from '../../shared/http/errors.js';
import { publicUserSelect } from './users.select.js';
import { page, rechercheSur, toSkipTake } from '../../shared/http/pagination.js';

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) {
    throw notFound('Utilisateur introuvable');
  }
  return user;
}

export async function listUsers(options) {
  const where = rechercheSur(['name', 'email', 'company'], options.search);
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: { ...publicUserSelect, _count: { select: { Projects: true } } },
      orderBy: { createdAt: 'desc' },
      ...toSkipTake(options),
    }),
    prisma.user.count({ where }),
  ]);
  return page(items, total, options);
}

export async function updateProfile(userId, champs) {
  if (champs.email) {
    const owner = await prisma.user.findUnique({
      where: { email: champs.email },
      select: { id: true },
    });
    if (owner && owner.id !== userId) {
      throw conflict(
        'Un compte existe déjà avec cet email',
        surLeChamp('email', 'Cet email est déjà utilisé'),
      );
    }
  }
  return prisma.user.update({ where: { id: userId }, data: champs, select: publicUserSelect });
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw notFound('Utilisateur introuvable');
  }
  if (!user.password) {
    throw badRequest(
      'Ce compte se connecte avec Google, il n’a pas de mot de passe',
      surLeChamp('currentPassword', 'Ce compte se connecte avec Google'),
    );
  }
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw badRequest(
      'Le mot de passe actuel est incorrect',
      surLeChamp('currentPassword', 'Mot de passe incorrect'),
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
  return { message: 'Mot de passe modifié' };
}

export async function changeRole(adminId, targetId, role) {
  if (adminId === targetId) {
    throw badRequest('Vous ne pouvez pas modifier votre propre rôle');
  }
  const cible = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
  if (!cible) {
    throw notFound('Utilisateur introuvable');
  }
  return prisma.user.update({ where: { id: targetId }, data: { role }, select: publicUserSelect });
}

export async function deleteUser(adminId, targetId) {
  if (adminId === targetId) {
    throw badRequest('Supprimez votre compte depuis votre profil');
  }
  const cible = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
  if (!cible) {
    throw notFound('Utilisateur introuvable');
  }
  await supprimerCompte(targetId);
}

export const deleteAccount = (userId) => supprimerCompte(userId);

function supprimerCompte(userId) {
  return prisma.$transaction([
    prisma.projectMaterial.deleteMany({ where: { project: { userId } } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}
