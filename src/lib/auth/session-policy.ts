import type { UserRole } from '@/generated/prisma';

/** 8h inactivity timeout for elevated (admin/staff) sessions (FR-14.5). */
export const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export const ELEVATED_ROLES: readonly UserRole[] = ['ADMIN', 'STAFF'];

export function isElevatedRole(role: UserRole | undefined): boolean {
  return role !== undefined && ELEVATED_ROLES.includes(role);
}

export function hasRole(role: UserRole | undefined, allowed: readonly UserRole[]): boolean {
  return role !== undefined && allowed.includes(role);
}

/** Should an elevated session be expired for inactivity? (FR-14.5) */
export function shouldExpireForInactivity(
  role: UserRole | undefined,
  lastActivityMs: number | undefined,
  nowMs: number,
): boolean {
  if (!isElevatedRole(role)) return false;
  if (!lastActivityMs) return false;
  return nowMs - lastActivityMs > ADMIN_SESSION_TTL_MS;
}
