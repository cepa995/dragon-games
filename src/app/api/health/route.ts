import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Liveness/readiness probe used by uptime monitoring (NFR-6.4) and CI smoke
 * checks. Reports application status plus a database connectivity check.
 */
export async function GET() {
  let database: 'ok' | 'error' = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = 'error';
  }

  const status = database === 'ok' ? 'ok' : 'degraded';
  return NextResponse.json(
    {
      status,
      service: 'dragon-games',
      checks: { database },
      timestamp: new Date().toISOString(),
    },
    { status: status === 'ok' ? 200 : 503 },
  );
}
