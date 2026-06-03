import { describe, expect, it } from 'vitest';
import {
  ADMIN_SESSION_TTL_MS,
  hasRole,
  isElevatedRole,
  shouldExpireForInactivity,
} from './session-policy';

describe('session policy', () => {
  it('identifies elevated roles', () => {
    expect(isElevatedRole('ADMIN')).toBe(true);
    expect(isElevatedRole('STAFF')).toBe(true);
    expect(isElevatedRole('MEMBER')).toBe(false);
    expect(isElevatedRole(undefined)).toBe(false);
  });

  it('checks role membership', () => {
    expect(hasRole('ADMIN', ['ADMIN', 'STAFF'])).toBe(true);
    expect(hasRole('MEMBER', ['ADMIN'])).toBe(false);
    expect(hasRole(undefined, ['ADMIN'])).toBe(false);
  });

  it('expires elevated sessions only after the inactivity window', () => {
    const now = 1_000_000_000;
    expect(shouldExpireForInactivity('ADMIN', now - ADMIN_SESSION_TTL_MS - 1, now)).toBe(true);
    expect(shouldExpireForInactivity('ADMIN', now - 1_000, now)).toBe(false);
    // Members never expire on the elevated timeout.
    expect(shouldExpireForInactivity('MEMBER', now - ADMIN_SESSION_TTL_MS - 1, now)).toBe(false);
    // No recorded activity → don't expire.
    expect(shouldExpireForInactivity('ADMIN', undefined, now)).toBe(false);
  });
});
