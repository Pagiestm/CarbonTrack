import { describe, expect, it, vi } from 'vitest';
import {
  ChangePassword,
  ChangeUserRole,
  DeleteAccount,
  DeleteUser,
  ListUsers,
} from '@/domain/use-cases/users/index.js';
import { fauxDepot, unePage, unUtilisateur } from '../helpers/doubles.js';

describe('ChangePassword', () => {
  const valide = {
    currentPassword: 'Ancien1!',
    newPassword: 'Nouveau1!',
    confirmPassword: 'Nouveau1!',
  };

  it('transmet quand tout concorde', async () => {
    const userRepository = fauxDepot({ changePassword: vi.fn().mockResolvedValue('ok') });
    await new ChangePassword({ userRepository }).execute(valide);
    expect(userRepository.changePassword).toHaveBeenCalledWith(valide);
  });

  it('refuse une confirmation différente, sans appeler le réseau', async () => {
    const userRepository = fauxDepot({ changePassword: vi.fn() });
    await expect(
      new ChangePassword({ userRepository }).execute({ ...valide, confirmPassword: 'autre' }),
    ).rejects.toThrow(/correspondent/);
    expect(userRepository.changePassword).not.toHaveBeenCalled();
  });

  it('refuse de remettre le mot de passe actuel', async () => {
    const userRepository = fauxDepot({ changePassword: vi.fn() });
    await expect(
      new ChangePassword({ userRepository }).execute({
        currentPassword: 'Pareil1!',
        newPassword: 'Pareil1!',
        confirmPassword: 'Pareil1!',
      }),
    ).rejects.toThrow(/différent/);
    expect(userRepository.changePassword).not.toHaveBeenCalled();
  });
});

describe('DeleteAccount', () => {
  it('efface la session après la suppression', async () => {
    const ordre = [];
    const userRepository = fauxDepot({
      deleteAccount: vi.fn(async () => ordre.push('suppression')),
    });
    const sessionRepository = fauxDepot({ clear: vi.fn(() => ordre.push('session')) });

    await new DeleteAccount({ userRepository, sessionRepository }).execute();

    expect(ordre).toEqual(['suppression', 'session']);
  });

  it('garde la session si la suppression échoue', async () => {
    const userRepository = fauxDepot({
      deleteAccount: vi.fn().mockRejectedValue(new Error('boum')),
    });
    const sessionRepository = fauxDepot({ clear: vi.fn() });

    await expect(
      new DeleteAccount({ userRepository, sessionRepository }).execute(),
    ).rejects.toThrow('boum');
    expect(sessionRepository.clear).not.toHaveBeenCalled();
  });
});

describe('administration des comptes', () => {
  it('liste avec pagination', async () => {
    const userRepository = fauxDepot({
      listAll: vi.fn().mockResolvedValue(unePage([unUtilisateur()])),
    });
    const page = await new ListUsers({ userRepository }).execute({ page: 2, perPage: 20 });
    expect(userRepository.listAll).toHaveBeenCalledWith({ page: 2, perPage: 20 });
    expect(page.items).toHaveLength(1);
  });

  it('change un rôle et supprime un compte', async () => {
    const userRepository = fauxDepot({
      changeRole: vi.fn().mockResolvedValue(unUtilisateur({ role: 'ADMIN' })),
      removeUser: vi.fn(),
    });

    const modifie = await new ChangeUserRole({ userRepository }).execute(7, 'ADMIN');
    expect(modifie.isAdmin).toBe(true);

    await new DeleteUser({ userRepository }).execute(7);
    expect(userRepository.removeUser).toHaveBeenCalledWith(7);
  });
});
