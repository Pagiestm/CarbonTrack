import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './shared/db/prisma.js';

const server = createApp().listen(env.PORT, () => {
  console.log(`API CarbonTrack à l'écoute sur le port ${env.PORT}`);
});

// Render envoie SIGTERM avant d'arrêter l'instance : on termine les requêtes
// en cours et on ferme les connexions à la base.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}
