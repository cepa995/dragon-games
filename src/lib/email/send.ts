import { Resend } from 'resend';
import { logger } from '@/lib/logger';

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? 'Dragon Games <onboarding@resend.dev>';

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends a transactional email via Resend. When no API key is configured (local
 * dev / CI), it logs the message instead of sending — so flows like email
 * verification and magic links are exercisable without a real provider. Real
 * keys are plugged in per environment.
 */
export async function sendEmail(message: EmailMessage): Promise<{ delivered: boolean }> {
  if (!apiKey) {
    logger.info(
      { to: message.to, subject: message.subject, preview: message.text.slice(0, 500) },
      'email not sent (no RESEND_API_KEY) — logging instead',
    );
    return { delivered: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (error) {
    logger.error({ err: error.message, to: message.to }, 'email send failed');
    throw new Error('email_send_failed');
  }
  return { delivered: true };
}
