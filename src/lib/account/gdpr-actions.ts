'use server';

import { signOut } from '@/auth';
import { verifyPassword } from '@/lib/auth/password';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { requestAccountDeletion } from './gdpr';

export interface DeletionState {
  error?: string;
}

/**
 * Verify the member (password if they have one), flag the account for deletion,
 * then sign out. Anonymization runs after the 30-day grace period.
 */
export async function requestDeletionAction(
  _prev: DeletionState,
  formData: FormData,
): Promise<DeletionState> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return { error: 'unauthorized' };

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return { error: 'unauthorized' };

  // Password-based accounts must re-enter their password to confirm.
  if (user.passwordHash) {
    const password = String(formData.get('password') ?? '');
    if (!(await verifyPassword(user.passwordHash, password))) {
      return { error: 'invalid_credentials' };
    }
  }

  await requestAccountDeletion(user.id);
  await signOut({ redirectTo: '/' });
  return {};
}
