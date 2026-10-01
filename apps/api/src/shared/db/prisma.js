import { PrismaClient } from '@prisma/client';

// Client unique pour toute l'application : un seul pool de connexions.
export const prisma = new PrismaClient();
