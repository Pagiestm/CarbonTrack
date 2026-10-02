import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppField from '@/presentation/components/ui/AppField.vue';

const monter = (props = {}) =>
  mount(AppField, { props: { id: 'champ', label: 'Libellé', ...props } });

describe('AppField', () => {
  it('relie l’étiquette au champ', () => {
    const vue = monter();
    expect(vue.find('label').attributes('for')).toBe('champ');
    expect(vue.find('input').attributes('id')).toBe('champ');
  });

  it('signale les champs facultatifs', () => {
    expect(monter({ required: false }).text()).toContain('facultatif');
    expect(monter().text()).not.toContain('facultatif');
  });

  it('remonte la saisie', async () => {
    const vue = monter();
    await vue.find('input').setValue('bonjour');
    expect(vue.emitted('update:modelValue').at(-1)).toEqual(['bonjour']);
  });

  describe('erreur', () => {
    it('affiche le message et marque le champ invalide', () => {
      const vue = monter({ error: 'Champ requis' });
      expect(vue.text()).toContain('Champ requis');
      expect(vue.find('input').attributes('aria-invalid')).toBe('true');
      expect(vue.find('input').attributes('aria-describedby')).toBe('champ-erreur');
    });

    it('prend le pas sur l’aide', () => {
      const vue = monter({ error: 'Erreur', hint: 'Aide' });
      expect(vue.text()).toContain('Erreur');
      expect(vue.text()).not.toContain('Aide');
    });
  });

  describe('mot de passe', () => {
    it('masque la valeur par défaut', () => {
      const vue = monter({ type: 'password' });
      expect(vue.find('input').attributes('type')).toBe('password');
      expect(vue.find('button').attributes('aria-pressed')).toBe('false');
    });

    it('la révèle au clic, et la masque à nouveau', async () => {
      const vue = monter({ type: 'password' });
      const bascule = vue.find('button');

      await bascule.trigger('click');
      expect(vue.find('input').attributes('type')).toBe('text');
      expect(bascule.attributes('aria-pressed')).toBe('true');
      expect(bascule.attributes('aria-label')).toBe('Masquer le mot de passe');

      await bascule.trigger('click');
      expect(vue.find('input').attributes('type')).toBe('password');
    });

    it("n'ajoute pas de bascule sur les autres types", () => {
      expect(monter({ type: 'email' }).find('button').exists()).toBe(false);
    });
  });

  it('rend une zone de texte quand on le demande', () => {
    const vue = monter({ multiline: true, rows: 4 });
    expect(vue.find('textarea').attributes('rows')).toBe('4');
  });

  it('rend une liste déroulante avec ses options', () => {
    const vue = mount(AppField, {
      props: { id: 'c', label: 'L', as: 'select' },
      slots: { default: '<option value="a">A</option>' },
    });
    expect(vue.find('select option').text()).toBe('A');
  });
});
