import { headers } from 'next/headers';

/** Header carrying the per-request correlation id (set by middleware). */
export const CORRELATION_HEADER = 'x-request-id';

/** Generate a new correlation id. */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Read the correlation id for the current request inside a Server Component or
 * Route Handler. Falls back to a fresh id if middleware didn't set one (e.g.
 * during prerendering).
 */
export async function getCorrelationId(): Promise<string> {
  const headerList = await headers();
  return headerList.get(CORRELATION_HEADER) ?? generateCorrelationId();
}
