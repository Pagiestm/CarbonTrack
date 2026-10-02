import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// Le domaine ne dépend ni de Vue ni du navigateur : ses tests tournent dans
// Node, sans environnement DOM ni serveur.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { include: ['test/**/*.test.js'] },
});
