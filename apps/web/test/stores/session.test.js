import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const casDUsage = {
  auth: {
    currentSession: { execute: vi.fn() },
    login: { execute: vi.fn() },
    logout: { execute: vi.fn() },
    finishGoogleLogin: { execute: vi.fn() },
    startGoogleLogin: { execute: vi.fn() },
  },
  users: { getProfile: { execute: vi.fn() } },
};

vi.mock('@/container.js', () => ({ useCases: casDUsage }));

const { useSessionStore } = await import('@/presentation/stores/session.js');

const session = (champs = {}) => ({
  token: 'jwt',
  userId: 1,
  role: 'USER',
  isValid: true,
  isAdmin: false,
  ...champs,
});

describe('store de session', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    casDUsage.auth.currentSession.execute.mockReturnValue(null);
  });

  it('part déconnecté quand il n’y a pas de session', () => {
    const store = useSessionStore();
    expect(store.estConnecte).toBe(false);
    expect(store.estAdmin).toBe(false);
  });

  it('se connecte et expose la session', async () => {
    casDUsage.auth.login.execute.mockResolvedValue(session());
    const store = useSessionStore();

    const ok = await store.connecter({ email: 'a@b.fr', password: 'x' });

    expect(ok).toBe(true);
    expect(store.estConnecte).toBe(true);
    expect(store.erreur).toBe('');
  });

  it('retient le message d’erreur et reste déconnecté', async () => {
    casDUsage.auth.login.execute.mockRejectedValue(new Error('Identifiants incorrects'));
    const store = useSessionStore();

    const ok = await store.connecter({ email: 'a@b.fr', password: 'faux' });

    expect(ok).toBe(false);
    expect(store.erreur).toBe('Identifiants incorrects');
    expect(store.estConnecte).toBe(false);
  });

  it('distingue un administrateur', async () => {
    casDUsage.auth.login.execute.mockResolvedValue(session({ isAdmin: true, role: 'ADMIN' }));
    const store = useSessionStore();
    await store.connecter({ email: 'a@b.fr', password: 'x' });
    expect(store.estAdmin).toBe(true);
  });

  it('se déconnecte', async () => {
    casDUsage.auth.login.execute.mockResolvedValue(session());
    const store = useSessionStore();
    await store.connecter({ email: 'a@b.fr', password: 'x' });

    store.deconnecter();

    expect(casDUsage.auth.logout.execute).toHaveBeenCalled();
    expect(store.estConnecte).toBe(false);
    expect(store.user).toBeNull();
  });

  it('récupère le jeton du retour Google', () => {
    casDUsage.auth.finishGoogleLogin.execute.mockReturnValue(session());
    const store = useSessionStore();

    expect(store.recupererJetonDeLUrl()).toBe(true);
    expect(store.estConnecte).toBe(true);
  });

  it('ne change rien si le fragment est vide', () => {
    casDUsage.auth.finishGoogleLogin.execute.mockReturnValue(null);
    const store = useSessionStore();

    expect(store.recupererJetonDeLUrl()).toBe(false);
    expect(store.estConnecte).toBe(false);
  });

  it('relit la session expirée au rafraîchissement', () => {
    const store = useSessionStore();
    casDUsage.auth.currentSession.execute.mockReturnValue(session({ isValid: false }));

    store.rafraichir();

    expect(store.estConnecte).toBe(false);
  });

  it('ne charge pas de profil sans session', async () => {
    const store = useSessionStore();
    expect(await store.chargerProfil()).toBeNull();
    expect(casDUsage.users.getProfile.execute).not.toHaveBeenCalled();
  });
});
