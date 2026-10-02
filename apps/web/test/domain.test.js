import { describe, expect, it } from 'vitest';
import { Footprint } from '@/domain/entities/Footprint.js';
import { Material } from '@/domain/entities/Material.js';
import { Project, ProjectLine } from '@/domain/entities/Project.js';
import { Session } from '@/domain/entities/Session.js';
import { User } from '@/domain/entities/User.js';

const beton = new Material({
  id: 1,
  name: 'Béton C25/30',
  supplier: 'X',
  carbonFootprint: '245.5',
  unit: 'm3',
  pricePerUnit: '120',
  categoryId: 1,
});

describe('Footprint', () => {
  it('additionne et arrondit au centième', () => {
    // Chaque empreinte est arrondie à sa construction : la somme porte donc
    // sur des valeurs déjà arrondies, jamais sur des flottants traînants.
    expect(new Footprint(1.0049).kg).toBe(1);
    expect(Footprint.somme([new Footprint(1.25), new Footprint(2.3)]).kg).toBe(3.55);
    expect(Footprint.somme([]).kg).toBe(0);
  });

  it('classe selon les seuils métier', () => {
    expect(new Footprint(999).niveau).toBe('faible');
    expect(new Footprint(1000).niveau).toBe('modere');
    expect(new Footprint(10_000).niveau).toBe('eleve');
  });

  it("s'affiche en tonnes au-delà du millier", () => {
    expect(new Footprint(999).format()).toBe('999 kg');
    expect(new Footprint(12_400).format()).toBe('12,4 t');
  });

  it('convertit en kilomètres en voiture thermique', () => {
    expect(new Footprint(193).kilometresVoiture).toBe(1000);
  });
});

describe('Material', () => {
  it('accepte les décimaux renvoyés en texte par Prisma', () => {
    expect(beton.carbonFootprint).toBe(245.5);
    expect(beton.footprintFor(2).kg).toBe(491);
    expect(beton.costFor(2)).toBe(240);
  });
});

describe('Project', () => {
  const projet = new Project({
    id: 1,
    name: 'Extension',
    totalFootprint: 600,
    userId: 1,
    lines: [
      new ProjectLine({ materialId: 1, quantity: 2, material: beton }), // 491
      new ProjectLine({ materialId: 2, quantity: 1, material: null }), // 0
    ],
  });

  it('trie la répartition du poste le plus lourd au plus léger', () => {
    const [premier, second] = projet.repartition;
    expect(premier.ligne.materialId).toBe(1);
    expect(Math.round(premier.part)).toBe(82);
    expect(second.part).toBe(0);
  });

  it("vaut zéro pour une ligne dont le matériau n'existe plus", () => {
    expect(projet.lines[1].footprint.kg).toBe(0);
    expect(projet.lines[1].cost).toBe(0);
  });
});

describe('User', () => {
  it('reconnaît un administrateur et un compte Google', () => {
    const admin = new User({ id: 1, email: 'a@b.fr', name: 'Marie Durand', role: 'ADMIN' });
    expect(admin.isAdmin).toBe(true);
    expect(admin.isGoogleAccount).toBe(false);
    expect(admin.initials).toBe('MD');

    const google = new User({ id: 2, email: 'c@d.fr', name: 'X', role: 'USER', googleId: 'g1' });
    expect(google.isGoogleAccount).toBe(true);
  });
});

describe('Session', () => {
  it('est invalide une fois expirée', () => {
    const passee = new Session({ token: 't', userId: 1, role: 'USER', expiresAt: Date.now() - 1 });
    expect(passee.isExpired).toBe(true);
    expect(passee.isValid).toBe(false);

    const vivante = new Session({
      token: 't',
      userId: 1,
      role: 'ADMIN',
      expiresAt: Date.now() + 1e5,
    });
    expect(vivante.isValid).toBe(true);
    expect(vivante.isAdmin).toBe(true);
  });
});
