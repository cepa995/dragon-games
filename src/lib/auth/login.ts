import type { User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from './password';
import { hashRecoveryCode, verifyTotp } from './totp';

export type CredentialResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'invalid' | 'inactive' | 'totp_required' | 'totp_invalid' };

/**
 * Verifies email/password and, for accounts with 2FA enabled, a TOTP or recovery
 * code (FR-14.2). Extracted from the Auth.js `authorize` callback so it can be
 * tested directly. Recovery codes are single-use.
 */
export async function verifyCredentials(input: {
  email: string;
  password: string;
  totp?: string | null;
}): Promise<CredentialResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user?.passwordHash) return { ok: false, reason: 'invalid' };
  if (user.status !== 'ACTIVE') return { ok: false, reason: 'inactive' };

  const passwordOk = await verifyPassword(user.passwordHash, input.password);
  if (!passwordOk) return { ok: false, reason: 'invalid' };

  if (user.totpEnabledAt && user.totpSecret) {
    const code = input.totp?.trim();
    if (!code) return { ok: false, reason: 'totp_required' };

    if (verifyTotp(code, user.totpSecret)) return { ok: true, user };
    if (await consumeRecoveryCode(user.id, code)) return { ok: true, user };
    return { ok: false, reason: 'totp_invalid' };
  }

  return { ok: true, user };
}

/** Consume a matching, unused recovery code. Returns true if one was spent. */
export async function consumeRecoveryCode(userId: string, code: string): Promise<boolean> {
  const codeHash = hashRecoveryCode(code);
  const record = await prisma.recoveryCode.findUnique({ where: { codeHash } });
  if (!record || record.userId !== userId || record.usedAt) return false;
  await prisma.recoveryCode.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  return true;
}
