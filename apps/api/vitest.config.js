import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Valeurs factices : les tests ne touchent ni la base ni le SMTP.
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'secret-de-test',
      FRONTEND_URL: 'http://localhost:5173',
    },
  },
});
