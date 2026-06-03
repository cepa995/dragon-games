import { hash, verify } from '@node-rs/argon2';

/**
 * Password hashing with Argon2id (NFR-2.2). Parameters follow the OWASP Password
 * Storage Cheat Sheet baseline (19 MiB memory, 2 iterations, 1 lane).
 */
const ARGON2_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(hashString: string, password: string): Promise<boolean> {
  try {
    return await verify(hashString, password);
  } catch {
    // Malformed hash (e.g. legacy/dev scrypt seed) — treat as non-match.
    return false;
  }
}
