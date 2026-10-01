import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// La CLI Prisma ne lit plus .env d'elle-même. process.loadEnvFile n'écrase
// pas une variable déjà définie : .env.local, chargé en premier, l'emporte.
for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
