import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'secret-de-test-assez-long-pour-les-tests',
      FRONTEND_URL: 'http://localhost:5173',
    },
  },
});
