'use server';

import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { AUTH_RATE_LIMIT, rateLimit } from '@/lib/auth/rate-limit';
import { getClientIp, normalizeLocale } from '@/lib/auth/request';
import { subscribeEmail } from './newsletter';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  source: z.string().trim().max(40).optional(),
  // Honeypot — real users never fill this hidden field.
  company: z.string().max(0).optional(),
});

export interface NewsletterState {
  error?: boolean;
  success?: boolean;
}

export async function newsletterSignupAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    source: formData.get('source') ?? undefined,
    company: formData.get('company') ?? undefined,
  });
  if (!parsed.success) return { error: true };

  // Silently accept honeypot hits so bots don't learn they were caught.
  if (parsed.data.company) return { success: true };

  const ip = await getClientIp();
  if (!rateLimit(`newsletter:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: true };
  }

  const locale = normalizeLocale(await getLocale());
  await subscribeEmail(parsed.data.email, parsed.data.source ?? 'home', ip, locale);
  return { success: true };
}
