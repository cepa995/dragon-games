'use server';

import { z } from 'zod';
import { AUTH_RATE_LIMIT, rateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/auth/request';
import { subscribeEmail } from './newsletter';

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export interface NewsletterState {
  error?: boolean;
  success?: boolean;
}

export async function newsletterSignupAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { error: true };

  const ip = await getClientIp();
  if (!rateLimit(`newsletter:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: true };
  }

  await subscribeEmail(parsed.data.email, 'home', ip);
  return { success: true };
}
