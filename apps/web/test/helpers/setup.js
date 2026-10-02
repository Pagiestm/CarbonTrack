import { afterEach, beforeEach, vi } from 'vitest';
import { config } from '@vue/test-utils';

config.global.stubs = {
  RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
  RouterView: true,
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});
