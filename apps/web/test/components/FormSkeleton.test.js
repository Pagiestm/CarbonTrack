import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormSkeleton from '@/presentation/components/ui/FormSkeleton.vue';

const champs = (wrapper) => wrapper.findAll('.space-y-5 > div:not(.flex)');

describe('FormSkeleton', () => {
  it('dessine un champ par ligne demandée, avec les boutons', () => {
    const wrapper = mount(FormSkeleton, { props: { fields: 4 } });

    expect(champs(wrapper)).toHaveLength(4);
    expect(wrapper.find('.justify-end').exists()).toBe(true);
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('agrandit le champ multiligne et peut masquer les boutons', () => {
    const wrapper = mount(FormSkeleton, { props: { fields: 3, multiline: 2, actions: false } });

    expect(champs(wrapper)[1].find('.h-24').exists()).toBe(true);
    expect(champs(wrapper)[0].find('.h-24').exists()).toBe(false);
    expect(wrapper.find('.justify-end').exists()).toBe(false);
  });
});
