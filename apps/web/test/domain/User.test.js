import { describe, expect, it } from 'vitest';
import { unUtilisateur } from '../helpers/doubles.js';

describe('User', () => {
  it('reconnaît un administrateur', () => {
    expect(unUtilisateur({ role: 'ADMIN' }).isAdmin).toBe(true);
    expect(unUtilisateur().isAdmin).toBe(false);
  });

  it('reconnaît un compte Google', () => {
    expect(unUtilisateur({ googleId: 'g-1' }).isGoogleAccount).toBe(true);
    expect(unUtilisateur().isGoogleAccount).toBe(false);
  });

  it('compose des initiales sur deux mots au plus', () => {
    expect(unUtilisateur({ name: 'Marie Durand' }).initials).toBe('MD');
    expect(unUtilisateur({ name: 'Jean Pierre Martin' }).initials).toBe('JP');
    expect(unUtilisateur({ name: 'Marie' }).initials).toBe('M');
    expect(unUtilisateur({ name: '' }).initials).toBe('');
  });

  describe('sous-titre', () => {
    it('assemble fonction et entreprise', () => {
      const u = unUtilisateur({ jobTitle: 'Architecte', company: 'Dupont & Fils' });
      expect(u.subtitle).toBe('Architecte chez Dupont & Fils');
    });

    it('se contente de ce qui est renseigné', () => {
      expect(unUtilisateur({ jobTitle: 'Maçon' }).subtitle).toBe('Maçon');
      expect(unUtilisateur({ company: 'Acme' }).subtitle).toBe('Acme');
      expect(unUtilisateur().subtitle).toBeNull();
    });
  });
});
