import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { Page } from '@/domain/entities/Page.js';
import AppPagination from '@/presentation/components/ui/AppPagination.vue';

const monter = (champs) =>
  mount(AppPagination, { props: { page: new Page({ items: [], ...champs }) } });

const numeros = (vue) =>
  vue
    .findAll('button')
    .map((b) => b.text())
    .filter((t) => t !== '');

describe('AppPagination', () => {
  it('ne s’affiche pas sur une seule page', () => {
    expect(monter({ total: 5, perPage: 12, pageCount: 1 }).html()).toBe('<!--v-if-->');
  });

  it('affiche les bornes', () => {
    const vue = monter({ total: 69, page: 2, perPage: 12, pageCount: 6 });
    expect(vue.text()).toContain('13–24');
    expect(vue.text()).toContain('69');
  });

  it('aligne toutes les pages quand il y en a peu', () => {
    expect(numeros(monter({ total: 50, page: 1, perPage: 12, pageCount: 5 }))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('résume avec des ellipses au-delà de sept pages', () => {
    expect(numeros(monter({ total: 500, page: 10, perPage: 12, pageCount: 42 }))).toEqual([
      '1',
      '…',
      '9',
      '10',
      '11',
      '…',
      '42',
    ]);
  });

  it('marque la page courante pour les lecteurs d’écran', () => {
    const vue = monter({ total: 50, page: 3, perPage: 12, pageCount: 5 });
    const courante = vue.findAll('button').find((b) => b.attributes('aria-current') === 'page');
    expect(courante.text()).toBe('3');
  });

  it('demande un changement de page au clic', async () => {
    const vue = monter({ total: 50, page: 1, perPage: 12, pageCount: 5 });
    await vue
      .findAll('button')
      .find((b) => b.text() === '3')
      .trigger('click');
    expect(vue.emitted('update:modelValue').at(-1)).toEqual([3]);
  });

  it('désactive la flèche précédente sur la première page', () => {
    const vue = monter({ total: 50, page: 1, perPage: 12, pageCount: 5 });
    const precedent = vue.find('[aria-label="Page précédente"]');
    expect(precedent.attributes('disabled')).toBeDefined();
  });
});
