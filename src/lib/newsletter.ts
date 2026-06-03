import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';

/**
 * Record a newsletter subscription (unconfirmed). The double opt-in confirmation
 * email + flow is added in M4 (#19); this captures the address + consent now.
 */
export async function subscribeEmail(email: string, source: string, ip?: string | null) {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) return { ok: true, already: true };

  await prisma.newsletterSubscriber.create({
    data: {
      email,
      source,
      unsubscribeToken: randomBytes(24).toString('base64url'),
      consentIp: ip ?? null,
      consentAt: new Date(),
    },
  });
  return { ok: true, already: false };
}
