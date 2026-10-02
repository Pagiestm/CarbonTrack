import { describe, expect, it } from 'vitest';
import { Footprint } from '@/domain/entities/Footprint.js';

describe('Footprint', () => {
  it('arrondit au centième à la construction', () => {
    expect(new Footprint(1.0049).kg).toBe(1);
    expect(new Footprint(1.005).kg).toBe(1);
    expect(new Footprint(1.006).kg).toBe(1.01);
  });

  it('additionne des empreintes déjà arrondies', () => {
    expect(Footprint.somme([new Footprint(1.25), new Footprint(2.3)]).kg).toBe(3.55);
    expect(Footprint.somme([]).kg).toBe(0);
  });

  describe('niveau', () => {
    it.each([
      [0, 'faible'],
      [999.99, 'faible'],
      [1000, 'modere'],
      [9999, 'modere'],
      [10_000, 'eleve'],
      [500_000, 'eleve'],
    ])('%d kg → %s', (kg, attendu) => {
      expect(new Footprint(kg).niveau).toBe(attendu);
    });
  });

  it('bascule en tonnes au-delà du millier', () => {
    expect(new Footprint(999).format()).toBe('999 kg');
    expect(new Footprint(1000).format()).toBe('1 t');
    expect(new Footprint(12_400).format()).toBe('12,4 t');
  });

  it('convertit en kilomètres de voiture thermique', () => {
    expect(new Footprint(193).kilometresVoiture).toBe(1000);
    expect(new Footprint(0).kilometresVoiture).toBe(0);
  });
});
