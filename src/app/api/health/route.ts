import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness/readiness probe used by uptime monitoring (NFR-6.4) and CI smoke
 * checks. The database readiness check is added in M2 (#2) once Prisma exists.
 */
export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'dragon-games',
    timestamp: new Date().toISOString(),
  });
}
