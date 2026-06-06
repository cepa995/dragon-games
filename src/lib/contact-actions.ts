'use server';

import { z } from 'zod';
import { rateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/auth/request';
import { logger } from '@/lib/logger';
import { contactSchema, submitContactMessage } from './contact';
import { verifyTurnstile } from './turnstile';

/** Contact form: 3 submissions / minute / IP (SRS NFR-2.8). */
const CONTACT_RATE_LIMIT = { limit: 3, windowMs: 60_000 } as const;

export type ContactError = 'invalid' | 'rate' | 'spam' | 'server';

export interface ContactState {
  error?: ContactError;
  success?: boolean;
}

// Honeypot field appended to the validated payload. Accept any value at the
// schema level so a bot-filled field reaches the silent-success branch below
// (rather than failing validation and revealing the trap).
const formSchema = contactSchema.extend({ company: z.string().optional() });

export async function contactSubmitAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    company: formData.get('company') ?? undefined,
  });
  if (!parsed.success) return { error: 'invalid' };

  // Honeypot hit — pretend success so bots don't learn they were filtered.
  if (parsed.data.company) return { success: true };

  const ip = await getClientIp();
  if (!rateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT.limit, CONTACT_RATE_LIMIT.windowMs).ok) {
    return { error: 'rate' };
  }

  const turnstileOk = await verifyTurnstile(
    formData.get('cf-turnstile-response')?.toString() ?? null,
  );
  if (!turnstileOk) return { error: 'spam' };

  try {
    const { company: _company, ...input } = parsed.data;
    await submitContactMessage(input);
    return { success: true };
  } catch (err) {
    logger.error({ err: (err as Error).message }, 'contact submission failed');
    return { error: 'server' };
  }
}
