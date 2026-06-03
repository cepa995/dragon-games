import { afterEach, describe, expect, it, vi } from 'vitest';
import { __resetRateLimit, rateLimit } from './rate-limit';

afterEach(() => {
  __resetRateLimit();
  vi.useRealTimers();
});

describe('rateLimit', () => {
  it('allows up to the limit, then blocks', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('k', 5, 60_000).ok).toBe(true);
    }
    const blocked = rateLimit('k', 5, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('tracks keys independently', () => {
    expect(rateLimit('a', 1, 60_000).ok).toBe(true);
    expect(rateLimit('a', 1, 60_000).ok).toBe(false);
    expect(rateLimit('b', 1, 60_000).ok).toBe(true);
  });

  it('resets after the window elapses', () => {
    vi.useFakeTimers();
    expect(rateLimit('w', 1, 1_000).ok).toBe(true);
    expect(rateLimit('w', 1, 1_000).ok).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(rateLimit('w', 1, 1_000).ok).toBe(true);
  });
});
