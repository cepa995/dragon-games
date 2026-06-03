import { headers } from 'next/headers';

/** Best-effort client IP for rate limiting. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? 'unknown';
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export function normalizeLocale(value: unknown): 'sr' | 'en' {
  return value === 'en' ? 'en' : 'sr';
}
