import { describe, expect, it, vi } from 'vitest';
import {
  CurrentSession,
  FinishGoogleLogin,
  Login,
  Logout,
  Register,
  ResetPassword,
} from '@/domain/use-cases/auth/index.js';
import { fauxDepot, unUtilisateur } from '../helpers/doubles.js';

describe('Login', () => {
  it('enregistre le jeton de la session obtenue', async () => {
    const authRepository = fauxDepot({ login: vi.fn().mockResolvedValue({ token: 'jwt' }) });
    const sessionRepository = fauxDepot({ save: vi.fn() });

    const session = await new Login({ authRepository, sessionRepository }).execute({
      email: 'a@b.fr',
      password: 'x',
    });

    expect(authRepository.login).toHaveBeenCalledWith({ email: 'a@b.fr', password: 'x' });
    expect(sessionRepository.save).toHaveBeenCalledWith('jwt');
    expect(session.token).toBe('jwt');
  });

  it("n'enregistre rien si l'authentification échoue", async () => {
    const authRepository = fauxDepot({ login: vi.fn().mockRejectedValue(new Error('refusé')) });
    const sessionRepository = fauxDepot({ save: vi.fn() });

    await expect(
      new Login({ authRepository, sessionRepository }).execute({ email: 'a@b.fr', password: 'x' }),
    ).rejects.toThrow('refusé');
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });
});

describe('Register', () => {
  it('renvoie le compte créé sans ouvrir de session', async () => {
    const authRepository = fauxDepot({ register: vi.fn().mockResolvedValue(unUtilisateur()) });
    const sessionRepository = fauxDepot({ save: vi.fn() });

    const compte = await new Register({ authRepository, sessionRepository }).execute({
      name: 'Marie',
      email: 'm@d.fr',
      password: 'Motdepasse1!',
    });

    expect(compte.name).toBe('Marie Durand');
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });
});

describe('Logout', () => {
  it('efface la session', () => {
    const sessionRepository = fauxDepot({ clear: vi.fn() });
    new Logout({ sessionRepository }).execute();
    expect(sessionRepository.clear).toHaveBeenCalled();
  });
});

describe('CurrentSession et FinishGoogleLogin', () => {
  it('délèguent au dépôt de session', () => {
    const sessionRepository = fauxDepot({
      read: vi.fn().mockReturnValue({ token: 't' }),
      consumeFromUrl: vi.fn().mockReturnValue(null),
    });

    expect(new CurrentSession({ sessionRepository }).execute()).toEqual({ token: 't' });
    expect(new FinishGoogleLogin({ sessionRepository }).execute()).toBeNull();
  });
});

describe('ResetPassword', () => {
  it("s'arrête avant l'appel réseau si la confirmation diffère", async () => {
    const authRepository = fauxDepot({ resetPassword: vi.fn() });

    await expect(
      new ResetPassword({ authRepository }).execute({
        token: 't',
        newPassword: 'Aa1!aaaa',
        confirmPassword: 'autre',
      }),
    ).rejects.toThrow(/correspondent/);
    expect(authRepository.resetPassword).not.toHaveBeenCalled();
  });

  it('transmet quand les deux concordent', async () => {
    const authRepository = fauxDepot({ resetPassword: vi.fn().mockResolvedValue('ok') });
    await new ResetPassword({ authRepository }).execute({
      token: 't',
      newPassword: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
    });
    expect(authRepository.resetPassword).toHaveBeenCalled();
  });
});
