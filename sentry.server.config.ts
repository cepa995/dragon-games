import * as Sentry from '@sentry/nextjs';
import { scrubEvent, type ScrubbableEvent } from '@/lib/sentry-scrub';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// No-ops when no DSN is configured (local/dev/CI) — safe to always call.
Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    scrubEvent(event as unknown as ScrubbableEvent);
    return event;
  },
});
