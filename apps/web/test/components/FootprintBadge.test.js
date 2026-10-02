import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { Footprint } from '@/domain/entities/Footprint.js';
import FootprintBadge from '@/presentation/components/ui/FootprintBadge.vue';

const monter = (kg) => mount(FootprintBadge, { props: { footprint: new Footprint(kg) } });

describe('FootprintBadge', () => {
  it('affiche la valeur formatée', () => {
    expect(monter(12_400).text()).toContain('12,4 t');
    expect(monter(500).text()).toContain('500 kg');
  });

  it.each([
    [500, 'level-low', 'sobre'],
    [5000, 'level-mid', 'modéré'],
    [50_000, 'level-high', 'élevé'],
  ])('%d kg → couleur %s', (kg, couleur, libelle) => {
    const badge = monter(kg);
    expect(badge.classes().join(' ')).toContain(couleur);
    expect(badge.text()).toContain(libelle);
  });
});
