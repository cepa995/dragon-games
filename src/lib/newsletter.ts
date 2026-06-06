import { randomBytes } from 'node:crypto';
import { appUrl } from '@/lib/auth/request';
import { sendEmail } from '@/lib/email/send';
import { newsletterConfirmEmail } from '@/lib/email/templates';
import { prisma } from '@/lib/prisma';

type Locale = 'sr' | 'en';

function token(): string {
  return randomBytes(24).toString('base64url');
}

function confirmUrl(locale: Locale, confirmToken: string): string {
  return `${appUrl()}/${locale}/newsletter/confirm?token=${confirmToken}`;
}

/**
 * GDPR double opt-in (SRS FR-8.2, NFR-3.6). Records the address with consent
 * metadata (timestamp + IP + source) in an *unconfirmed* state and emails a
 * confirmation link. The subscription only becomes active once the recipient
 * confirms. Re-subscribing an unconfirmed address re-sends a fresh link;
 * already-confirmed addresses are left untouched.
 */
export async function subscribeEmail(
  email: string,
  source: string,
  ip: string | null,
  locale: Locale,
): Promise<{ ok: true; already: boolean }> {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing?.confirmedAt) return { ok: true, already: true };

  const confirmToken = token();

  if (existing) {
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { confirmToken, source, consentIp: ip, consentAt: new Date() },
    });
  } else {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source,
        confirmToken,
        unsubscribeToken: token(),
        consentIp: ip,
        consentAt: new Date(),
      },
    });
  }

  await sendEmail(newsletterConfirmEmail(email, confirmUrl(locale, confirmToken), locale));
  return { ok: true, already: false };
}

/** Confirm a double opt-in by token (SRS FR-8.2). Idempotent for a used token. */
export async function confirmSubscription(
  confirmToken: string,
): Promise<{ ok: boolean; email?: string }> {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmToken } });
  if (!subscriber) return { ok: false };

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { confirmedAt: subscriber.confirmedAt ?? new Date(), confirmToken: null },
  });
  return { ok: true, email: subscriber.email };
}

/** One-click unsubscribe by token (SRS FR-8.4). */
export async function unsubscribe(
  unsubscribeToken: string,
): Promise<{ ok: boolean; email?: string }> {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken } });
  if (!subscriber) return { ok: false };

  await prisma.newsletterSubscriber.delete({ where: { id: subscriber.id } });
  return { ok: true, email: subscriber.email };
}
