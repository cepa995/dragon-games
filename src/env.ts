import { z } from 'zod';

/**
 * Typed, validated environment. Import `env` instead of reading `process.env`
 * directly so a missing/invalid var fails fast at boot with a clear message
 * (NFR-8.5) rather than surfacing as a confusing runtime error later.
 *
 * Set `SKIP_ENV_VALIDATION=1` to bypass (e.g. Docker image builds, linting).
 * Optional integrations (Auth, Resend, Sentry, Turnstile) are wired in later
 * milestones; their vars are optional here so the foundation runs without them.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_TEST: z.string().url().optional(),
  AUTH_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
});

const fullSchema = serverSchema.merge(clientSchema);

function parseEnv() {
  if (process.env.SKIP_ENV_VALIDATION) {
    // Trust the shape without validating — used where secrets are absent by
    // design (image builds, static analysis).
    return process.env as unknown as z.infer<typeof fullSchema>;
  }

  const parsed = fullSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`❌ Invalid environment variables:\n${issues}`);
  }
  return parsed.data;
}

export const env = parseEnv();
