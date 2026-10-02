import { describe, expect, it } from 'vitest';
import {
  changePasswordBody,
  changeRoleBody,
  updateProfileBody,
} from '../../src/modules/users/users.schemas.js';

describe('updateProfileBody', () => {
  it('accepte les champs de profil', () => {
    const resultat = updateProfileBody.safeParse({
      name: 'Marie',
      company: 'Dupont & Fils',
      jobTitle: 'Architecte',
      phone: '06 12 34 56 78',
      city: 'Nantes',
    });
    expect(resultat.success).toBe(true);
  });

  it('refuse toujours les champs non modifiables', () => {
    const resultat = updateProfileBody.safeParse({ name: 'A', role: 'ADMIN' });
    expect(resultat.success).toBe(false);
    expect(resultat.error.issues[0].message).toContain('role');
  });

  it('accepte null pour vider un champ facultatif', () => {
    expect(updateProfileBody.safeParse({ company: null }).success).toBe(true);
  });
});

describe('changePasswordBody', () => {
  const valide = {
    currentPassword: 'Ancien1!',
    newPassword: 'Nouveau1!',
    confirmPassword: 'Nouveau1!',
  };

  it('accepte une demande cohérente', () => {
    expect(changePasswordBody.safeParse(valide).success).toBe(true);
  });

  it('exige le mot de passe actuel', () => {
    expect(changePasswordBody.safeParse({ ...valide, currentPassword: '' }).success).toBe(false);
  });

  it('refuse une confirmation différente', () => {
    const resultat = changePasswordBody.safeParse({ ...valide, confirmPassword: 'autre' });
    expect(resultat.success).toBe(false);
    expect(resultat.error.issues[0].path).toEqual(['confirmPassword']);
  });

  it('applique les règles de robustesse au nouveau mot de passe', () => {
    const faible = { ...valide, newPassword: 'motdepasse', confirmPassword: 'motdepasse' };
    expect(changePasswordBody.safeParse(faible).success).toBe(false);
  });
});

describe('changeRoleBody', () => {
  it('n’accepte que les rôles connus', () => {
    expect(changeRoleBody.safeParse({ role: 'ADMIN' }).success).toBe(true);
    expect(changeRoleBody.safeParse({ role: 'USER' }).success).toBe(true);
    expect(changeRoleBody.safeParse({ role: 'SUPERADMIN' }).success).toBe(false);
  });
});
