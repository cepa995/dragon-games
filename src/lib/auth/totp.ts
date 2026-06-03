import { createHash, randomBytes } from 'node:crypto';
import { authenticator } from 'otplib';

// Allow ±1 step (±30s) for client clock skew.
authenticator.options = { window: 1 };

export const TOTP_ISSUER = 'Dragon Games';

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function totpKeyUri(accountName: string, secret: string): string {
  return authenticator.keyuri(accountName, TOTP_ISSUER, secret);
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token: token.replace(/\s/g, ''), secret });
  } catch {
    return false;
  }
}

/** Generate human-friendly single-use recovery codes (e.g. "3f9a1-b7c20"). */
export function generateRecoveryCodes(count = 10): string[] {
  return Array.from({ length: count }, () => {
    const raw = randomBytes(5).toString('hex');
    return `${raw.slice(0, 5)}-${raw.slice(5, 10)}`;
  });
}

/** Normalize (strip dashes/case) and hash a recovery code for storage. */
export function hashRecoveryCode(code: string): string {
  const normalized = code.replace(/[\s-]/g, '').toLowerCase();
  return createHash('sha256').update(normalized).digest('hex');
}
