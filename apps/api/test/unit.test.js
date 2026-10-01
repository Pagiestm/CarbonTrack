import { describe, expect, it } from 'vitest';
import { computeFootprint } from '../src/modules/projects/footprint.js';
import { projectBody } from '../src/modules/projects/projects.schemas.js';
import { materialBody } from '../src/modules/catalog/catalog.schemas.js';
import { updateProfileBody } from '../src/modules/users/users.schemas.js';
import { password } from '../src/shared/http/schemas.js';
import { signAccessToken, signResetToken, verifyAccessToken, verifyResetToken } from '../src/shared/auth/tokens.js';

describe('computeFootprint', () => {
  it('additionne empreinte × quantité, y compris des Decimal en texte', () => {
    expect(computeFootprint([
      { carbonFootprint: '12.50', quantity: 2 },
      { carbonFootprint: 3, quantity: 1.5 },
    ])).toBe(29.5);
  });

  it('arrondit au centième et vaut 0 sans matériau', () => {
    expect(computeFootprint([{ carbonFootprint: '0.1', quantity: 3 }])).toBe(0.3);
    expect(computeFootprint([])).toBe(0);
  });
});

describe('jetons', () => {
  const user = { id: 7, role: 'USER' };

  it('un jeton de session est accepté comme tel', () => {
    expect(verifyAccessToken(signAccessToken(user))).toMatchObject({ userId: 7, role: 'USER' });
  });

  it('un jeton de réinitialisation ne vaut pas session, et inversement', () => {
    expect(() => verifyAccessToken(signResetToken(user))).toThrow();
    expect(() => verifyResetToken(signAccessToken(user))).toThrow();
    expect(verifyResetToken(signResetToken(user)).userId).toBe(7);
  });
});

describe('schémas', () => {
  it('le mot de passe exige minuscule, majuscule, chiffre, symbole et 8 caractères', () => {
    expect(password.safeParse('Azerty123*').success).toBe(true);
    for (const weak of ['azerty123*', 'AZERTY123*', 'Azertyuio*', 'Azerty1234', 'Az1*']) {
      expect(password.safeParse(weak).success).toBe(false);
    }
  });

  it('un matériau accepte les nombres envoyés en texte et ignore les clés en trop', () => {
    const result = materialBody.parse({
      id: 3, name: 'Acier', supplier: 'ACME', carbonFootprint: '12.50', unit: 'kg', pricePerUnit: '4', categoryId: '2',
    });
    expect(result).toEqual({ name: 'Acier', supplier: 'ACME', carbonFootprint: 12.5, unit: 'kg', pricePerUnit: 4, categoryId: 2 });
  });

  it('un projet ignore totalFootprint et userId, et refuse un matériau en double', () => {
    expect(projectBody.parse({ name: 'P', totalFootprint: 0, userId: null, materials: [{ materialId: 1, quantity: '2' }] }))
      .toEqual({ name: 'P', materials: [{ materialId: 1, quantity: 2 }] });
    expect(projectBody.safeParse({ name: 'P', materials: [{ materialId: 1, quantity: 1 }, { materialId: 1, quantity: 2 }] }).success)
      .toBe(false);
  });

  it('le profil refuse les champs non modifiables comme role', () => {
    const result = updateProfileBody.safeParse({ name: 'A', role: 'ADMIN' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain('role');
  });
});
