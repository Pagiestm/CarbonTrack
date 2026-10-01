import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../config/env.js';
import { PrismaClient } from '../../generated/prisma/client.ts';

// Client unique pour toute l'application : un seul pool de connexions.
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});
