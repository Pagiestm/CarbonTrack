import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: false,
    projects: [
      {
        extends: true,
        test: {
          name: 'domaine',
          environment: 'node',
          include: ['test/{domain,use-cases,data}/**/*.test.js'],
        },
      },
      {
        extends: true,
        test: {
          name: 'interface',
          environment: 'jsdom',
          setupFiles: ['test/helpers/setup.js'],
          include: ['test/{components,stores,storage}/**/*.test.js'],
        },
      },
    ],
  },
});
