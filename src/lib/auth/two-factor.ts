import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import {
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  totpKeyUri,
  verifyTotp,
} from './totp';

/**
 * Start TOTP enrolment: generate and persist a secret (not yet active) and
 * return the otpauth URI + a QR data-URL to display. Activation requires a valid
 * code via `confirmTwoFactor` (FR-14.2).
 */
export async function beginTwoFactorSetup(userId: string, accountName: string) {
  const secret = generateTotpSecret();
  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: secret, totpEnabledAt: null },
  });
  const keyUri = totpKeyUri(accountName, secret);
  const qr = await QRCode.toDataURL(keyUri);
  return { secret, keyUri, qr };
}

/**
 * Activate 2FA once the user proves possession with a valid code. Returns the
 * one-time recovery codes (shown once), or null if the code is wrong.
 */
export async function confirmTwoFactor(userId: string, code: string): Promise<string[] | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.totpSecret) return null;
  if (!verifyTotp(code, user.totpSecret)) return null;

  const codes = generateRecoveryCodes();
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { totpEnabledAt: new Date() } }),
    prisma.recoveryCode.deleteMany({ where: { userId } }),
    prisma.recoveryCode.createMany({
      data: codes.map((c) => ({ userId, codeHash: hashRecoveryCode(c) })),
    }),
  ]);
  return codes;
}

export async function disableTwoFactor(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { totpSecret: null, totpEnabledAt: null },
    }),
    prisma.recoveryCode.deleteMany({ where: { userId } }),
  ]);
}
