import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './shared/db/prisma.js';

const server = createApp().listen(env.PORT, () => {
  console.log(`API CarbonTrack à l'écoute sur le port ${env.PORT}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}
