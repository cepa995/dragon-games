import type { Locale } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { hashPassword } from './password';
import { consumeUserToken, createUserToken } from './tokens';

export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export type RegisterResult =
  | { ok: true; userId: string; verifyToken: string }
  | { ok: false; reason: 'email_taken' };

/** Create a member account (unverified) and a verification token to email. */
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  locale: Locale;
}): Promise<RegisterResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) return { ok: false, reason: 'email_taken' };

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, locale: input.locale },
  });
  const verifyToken = await createUserToken(
    user.id,
    'EMAIL_VERIFICATION',
    EMAIL_VERIFICATION_TTL_MS,
  );
  return { ok: true, userId: user.id, verifyToken };
}

/** Mark a user's email verified given a valid token. */
export async function verifyEmail(token: string): Promise<boolean> {
  const userId = await consumeUserToken(token, 'EMAIL_VERIFICATION');
  if (!userId) return false;
  await prisma.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
  return true;
}

/** Issue a password-reset token for an account, or null if no such account. */
export async function createPasswordReset(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return createUserToken(user.id, 'PASSWORD_RESET', PASSWORD_RESET_TTL_MS);
}

/** Set a new password given a valid reset token. */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const userId = await consumeUserToken(token, 'PASSWORD_RESET');
  if (!userId) return false;
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return true;
}
