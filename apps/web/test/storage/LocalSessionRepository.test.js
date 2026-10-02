import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalSessionRepository } from '@/data/storage/LocalSessionRepository.js';

const jetonValide = (charge) => {
  const base64 = btoa(JSON.stringify(charge)).replace(/\+/g, '-').replace(/\//g, '_');
  return `entete.${base64}.signature`;
};

describe('LocalSessionRepository', () => {
  let depot;

  beforeEach(() => {
    localStorage.clear();
    depot = new LocalSessionRepository();
  });

  it('enregistre puis relit une session', () => {
    const jeton = jetonValide({ userId: 1, role: 'USER', exp: 2_000_000_000 });
    depot.save(jeton);
    expect(depot.read().userId).toBe(1);
  });

  it('renvoie null quand rien n’est enregistré', () => {
    expect(depot.read()).toBeNull();
  });

  it('nettoie un jeton illisible plutôt que de le garder', () => {
    localStorage.setItem('authToken', 'n-importe-quoi');
    expect(depot.read()).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('efface aussi la clé des anciennes versions', () => {
    localStorage.setItem('role', 'ADMIN');
    depot.clear();
    expect(localStorage.getItem('role')).toBeNull();
  });

  describe('retour de Google', () => {
    it('consomme le jeton du fragment et nettoie l’URL', () => {
      const jeton = jetonValide({ userId: 9, role: 'ADMIN', exp: 2_000_000_000 });
      window.location.hash = `#token=${jeton}`;
      const remplace = vi.spyOn(window.history, 'replaceState');

      const session = depot.consumeFromUrl();

      expect(session.userId).toBe(9);
      expect(localStorage.getItem('authToken')).toBe(jeton);
      expect(remplace).toHaveBeenCalled();
    });

    it('ne fait rien sans fragment', () => {
      window.location.hash = '';
      expect(depot.consumeFromUrl()).toBeNull();
    });
  });
});
