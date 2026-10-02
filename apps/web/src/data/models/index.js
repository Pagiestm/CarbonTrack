import { Category } from '@/domain/entities/Category.js';
import { Material } from '@/domain/entities/Material.js';
import { Project, ProjectLine } from '@/domain/entities/Project.js';
import { Session } from '@/domain/entities/Session.js';
import { User } from '@/domain/entities/User.js';

/**
 * Traduction des réponses de l'API en entités du domaine.
 *
 * C'est le seul endroit qui connaît la forme exacte du JSON renvoyé (noms de
 * champs, `ProjectMaterial` en PascalCase, décimaux en chaîne…). Si l'API
 * change, c'est ici que ça se corrige, et nulle part ailleurs.
 */
export const toUser = (brut) => new User(brut);

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

export const toProject = (brut) =>
  new Project({
    ...brut,
    lines: (brut.ProjectMaterial ?? []).map(
      (ligne) =>
        new ProjectLine({
          materialId: ligne.materialId,
          quantity: ligne.quantity,
          material: ligne.material ? toMaterial(ligne.material) : null,
        }),
    ),
  });

/** Le jeton est un JWT : on en lit la charge utile pour l'affichage. */
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
