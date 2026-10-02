import { Category } from '@/domain/entities/Category.js';
import { Material } from '@/domain/entities/Material.js';
import { Project, ProjectLine } from '@/domain/entities/Project.js';
import { Page } from '@/domain/entities/Page.js';
import { Session } from '@/domain/entities/Session.js';
import { User } from '@/domain/entities/User.js';

export const toUser = (brut) => new User({ ...brut, projectCount: brut._count?.Projects ?? null });

export const toMaterial = (brut) =>
  new Material({
    ...brut,
    category: brut.category ? new Category(brut.category) : null,
  });

export const toCategory = (brut) =>
  new Category({
    ...brut,
    materials: (brut.Materials ?? brut.materials ?? []).map(toMaterial),
  });

export const toPage = (brut, transforme) =>
  new Page({ ...brut, items: (brut.items ?? []).map(transforme) });

export const toProject = (brut) =>
  new Project({
    ...brut,
    lineCount: brut._count?.ProjectMaterial ?? null,
    lines: (brut.ProjectMaterial ?? []).map(
      (ligne) =>
        new ProjectLine({
          materialId: ligne.materialId,
          quantity: ligne.quantity,
          material: ligne.material ? toMaterial(ligne.material) : null,
        }),
    ),
  });

export const toSession = (token) => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  const charge = JSON.parse(json);
  return new Session({
    token,
    userId: charge.userId,
    role: charge.role,
    expiresAt: charge.exp * 1000,
  });
};
