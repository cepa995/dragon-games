/**
 * Minimal fixed-window rate limiter (NFR-2.8). In-memory and therefore
 * per-instance — sufficient for a single-node deployment and for tests. A shared
 * store (Redis/Upstash) is swapped in for multi-instance production in M9 (#40).
 */
type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  // E2E-only escape hatch: all localhost requests share one IP bucket, which
  // would make the happy-path auth specs flaky. The limiter logic itself is
  // covered by unit tests. Never set this in production.
  if (process.env.AUTH_RATE_LIMIT_DISABLED === '1') {
    return { ok: true, remaining: limit, retryAfterMs: 0 };
  }

  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, retryAfterMs: 0 };
}

/** Common auth limits (per identifier+IP). */
export const AUTH_RATE_LIMIT = { limit: 5, windowMs: 60_000 } as const;

/** Test-only: clear all buckets. */
export function __resetRateLimit() {
  store.clear();
}
