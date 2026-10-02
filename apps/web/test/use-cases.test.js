import { describe, expect, it, vi } from 'vitest';
import { CreateProject, EstimateFootprint } from '@/domain/use-cases/projects/index.js';
import { Login, Logout, ResetPassword } from '@/domain/use-cases/auth/index.js';
import { DeleteAccount } from '@/domain/use-cases/users/index.js';
import { Material } from '@/domain/entities/Material.js';

/*
  Ces tests sont tout l'intérêt de la séparation en couches : les cas d'usage
  reçoivent de faux dépôts, donc aucun serveur, aucun navigateur, aucun
  localStorage n'est nécessaire.
*/

describe('CreateProject', () => {
  const depotAvecEspion = () => ({ create: vi.fn().mockResolvedValue({ id: 7 }) });

  it('normalise les lignes et transmet au dépôt', async () => {
    const projectRepository = depotAvecEspion();
    await new CreateProject({ projectRepository }).execute({
      name: 'P',
      description: '',
      materials: [
        { materialId: '3', quantity: '2.5' },
        { materialId: '', quantity: '9' }, // ligne vide, ignorée
      ],
    });

    expect(projectRepository.create).toHaveBeenCalledWith({
      name: 'P',
      description: '',
      materials: [{ materialId: 3, quantity: 2.5 }],
    });
  });

  it('refuse un projet sans aucune ligne utilisable', async () => {
    const cas = new CreateProject({ projectRepository: depotAvecEspion() });
    await expect(
      cas.execute({ name: 'P', materials: [{ materialId: '', quantity: '' }] }),
    ).rejects.toThrow(/au moins un matériau/);
  });

  it('refuse deux fois le même matériau', async () => {
    const cas = new CreateProject({ projectRepository: depotAvecEspion() });
    await expect(
      cas.execute({
        name: 'P',
        materials: [
          { materialId: 1, quantity: 1 },
          { materialId: 1, quantity: 2 },
        ],
      }),
    ).rejects.toThrow(/qu'une fois/);
  });
});

describe('EstimateFootprint', () => {
  it("additionne les lignes à partir du catalogue, sans toucher à l'API", () => {
    const materiaux = new Map([
      [1, new Material({ id: 1, carbonFootprint: 10, pricePerUnit: 0, unit: 'u', categoryId: 1 })],
    ]);
    const total = new EstimateFootprint().execute(
      [
        { materialId: 1, quantity: 3 },
        { materialId: 99, quantity: 5 }, // inconnu du catalogue
        { materialId: 1, quantity: 0 }, // quantité nulle
      ],
      materiaux,
    );
    expect(total.kg).toBe(30);
  });
});

describe('Login', () => {
  it('enregistre la session renvoyée par le dépôt', async () => {
    const authRepository = { login: vi.fn().mockResolvedValue({ token: 'jwt' }) };
    const sessionRepository = { save: vi.fn() };

    await new Login({ authRepository, sessionRepository }).execute({
      email: 'a@b.fr',
      password: 'x',
    });

    expect(sessionRepository.save).toHaveBeenCalledWith('jwt');
  });
});

describe('Logout et DeleteAccount', () => {
  it('effacent la session', async () => {
    const sessionRepository = { clear: vi.fn() };
    new Logout({ sessionRepository }).execute();
    expect(sessionRepository.clear).toHaveBeenCalled();

    const userRepository = { deleteAccount: vi.fn().mockResolvedValue() };
    await new DeleteAccount({ userRepository, sessionRepository }).execute();
    expect(userRepository.deleteAccount).toHaveBeenCalled();
    expect(sessionRepository.clear).toHaveBeenCalledTimes(2);
  });
});

describe('ResetPassword', () => {
  it("s'arrête avant l'appel réseau si la confirmation diffère", async () => {
    const authRepository = { resetPassword: vi.fn() };
    const cas = new ResetPassword({ authRepository });

    await expect(
      cas.execute({ token: 't', newPassword: 'Aa1!aaaa', confirmPassword: 'autre' }),
    ).rejects.toThrow(/correspondent/);
    expect(authRepository.resetPassword).not.toHaveBeenCalled();
  });
});
