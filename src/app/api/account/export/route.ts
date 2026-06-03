import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { exportUserData } from '@/lib/account/gdpr';

export const dynamic = 'force-dynamic';

/** Downloads the signed-in member's personal data as JSON (NFR-3.4). */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await exportUserData(session.user.id);
  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="dragon-games-data.json"',
    },
  });
}
