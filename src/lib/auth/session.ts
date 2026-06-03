import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { UserRole } from '@/generated/prisma';
import { hasRole } from './session-policy';

export { hasRole, isElevatedRole, shouldExpireForInactivity } from './session-policy';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require any authenticated user, else redirect to login. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/sr/login');
  return user;
}

/** Require one of the allowed roles, else redirect. Used to gate /admin (M8). */
export async function requireRole(allowed: readonly UserRole[]) {
  const user = await getCurrentUser();
  if (!user || !hasRole(user.role, allowed)) redirect('/sr/login');
  return user;
}
