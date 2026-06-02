import * as Sentry from '@sentry/nextjs';

/**
 * Runs once when the server process starts. Loads the Sentry config for the
 * active runtime and validates the environment (fail-fast at boot, NFR-8.5).
 */
export async function register() {
  // Validate env at startup (skipped during builds via SKIP_ENV_VALIDATION).
  await import('@/env');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

// Captures errors thrown in nested React Server Components (App Router).
export const onRequestError = Sentry.captureRequestError;
