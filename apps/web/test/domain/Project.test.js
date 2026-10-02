import { describe, expect, it } from 'vitest';
import { Project } from '@/domain/entities/Project.js';
import { uneLigne, unMateriau, unProjet } from '../helpers/doubles.js';

describe('Project', () => {
  it('traduit son type et son statut', () => {
    const projet = unProjet({ kind: 'RENOVATION', status: 'DONE' });
    expect(projet.kindLabel).toBe('Rénovation');
    expect(projet.statusLabel).toBe('Terminé');
  });

  it('retombe sur la valeur brute si elle est inconnue', () => {
    expect(unProjet({ kind: 'INCONNU' }).kindLabel).toBe('INCONNU');
  });

  describe('répartition', () => {
    const projet = unProjet({
      totalFootprint: 600,
      lines: [
        uneLigne({ materialId: 1, quantity: 2 }),
        uneLigne({
          materialId: 2,
          quantity: 1,
          material: unMateriau({ id: 2, carbonFootprint: 10 }),
        }),
        uneLigne({ materialId: 3, quantity: 5, material: null }),
      ],
    });

    it('va du poste le plus lourd au plus léger', () => {
      expect(projet.repartition.map(({ ligne }) => ligne.materialId)).toEqual([1, 2, 3]);
    });

    it('exprime chaque poste en pourcentage du total', () => {
      expect(Math.round(projet.repartition[0].part)).toBe(82);
      expect(projet.repartition.at(-1).part).toBe(0);
    });

    it("compte zéro pour une ligne dont le matériau n'existe plus", () => {
      const orpheline = projet.lines.find((l) => !l.material);
      expect(orpheline.footprint.kg).toBe(0);
      expect(orpheline.cost).toBe(0);
    });

    it('désigne le poste dominant', () => {
      expect(projet.dominantLine.materialId).toBe(1);
    });
  });

  describe('ramené au mètre carré', () => {
    it('divise par la surface', () => {
      const projet = unProjet({ totalFootprint: 4000, surface: 40 });
      expect(projet.footprintPerSquareMeter.kg).toBe(100);
    });

    it("n'invente rien quand la surface est absente", () => {
      const projet = unProjet({ surface: null });
      expect(projet.footprintPerSquareMeter).toBeNull();
      expect(projet.costPerSquareMeter).toBeNull();
    });
  });

  it('compte ses lignes même quand la liste est absente', () => {
    const vignette = new Project({ id: 1, name: 'P', totalFootprint: 0, userId: 1, lineCount: 7 });
    expect(vignette.lineCount).toBe(7);
    expect(unProjet().lineCount).toBe(1);
  });
});
