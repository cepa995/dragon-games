import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { UserTokenPurpose } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

/** A high-entropy, URL-safe token to email to the user. */
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Hash a token for storage. These are **256-bit cryptographically-random**
 * values from `generateToken()` (not user passwords), so a fast hash is the
 * correct, standard choice — the same approach used for reset/verification
 * tokens by Django, Rails, etc. There is nothing to brute-force at 2^256, so a
 * slow KDF (Argon2/bcrypt) would add cost without security benefit. User
 * passwords use Argon2id in `password.ts`.
 */
export function hashToken(token: string): string {
  // codeql[js/insufficient-password-hash] — random tokens, not passwords.
  return createHash('sha256').update(token).digest('hex');
}

/** Constant-time comparison of two hex digests. */
export function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Create a single-use token for a user and return the plaintext to email. */
export async function createUserToken(
  userId: string,
  purpose: UserTokenPurpose,
  ttlMs: number,
): Promise<string> {
  const token = generateToken();
  // Invalidate any outstanding tokens of the same purpose first.
  await prisma.userToken.deleteMany({ where: { userId, purpose } });
  await prisma.userToken.create({
    data: { userId, purpose, tokenHash: hashToken(token), expires: new Date(Date.now() + ttlMs) },
  });
  return token;
}

/**
 * Validate and consume a token. Returns the owning userId, or null if the token
 * is unknown, of the wrong purpose, or expired. Single-use: deleted on success.
 */
export async function consumeUserToken(
  token: string,
  purpose: UserTokenPurpose,
): Promise<string | null> {
  const record = await prisma.userToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.purpose !== purpose) return null;
  if (record.expires.getTime() < Date.now()) {
    await prisma.userToken.delete({ where: { id: record.id } }).catch(() => {});
    return null;
  }
  await prisma.userToken.delete({ where: { id: record.id } });
  return record.userId;
}
