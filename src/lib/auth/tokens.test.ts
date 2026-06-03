import { describe, expect, it } from 'vitest';
import { generateToken, hashToken, safeEqualHex } from './tokens';

describe('token helpers', () => {
  it('generates unique, URL-safe tokens', () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(a.length).toBeGreaterThanOrEqual(43);
  });

  it('hashes deterministically to sha-256 hex', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
    expect(hashToken('abc')).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken('abc')).not.toBe(hashToken('abd'));
  });

  it('compares hex digests in constant time', () => {
    expect(safeEqualHex(hashToken('x'), hashToken('x'))).toBe(true);
    expect(safeEqualHex(hashToken('x'), hashToken('y'))).toBe(false);
    expect(safeEqualHex('aa', 'aabb')).toBe(false);
  });
});
