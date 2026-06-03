import { PrismaClient } from '@/generated/prisma';

/**
 * Singleton Prisma client. In development Next.js clears the module cache on
 * every request, which would otherwise exhaust the connection pool — so we cache
 * the instance on `globalThis`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
