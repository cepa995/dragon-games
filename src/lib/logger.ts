import pino from 'pino';

/**
 * Structured JSON application logger (NFR-7.1). Emits one JSON object per line —
 * pipe through `pino-pretty` locally for readability (`pnpm dev | pino-pretty`).
 *
 * Secrets and credentials are redacted at the logger level so they can never
 * leak into logs regardless of the call site. Attach a correlation id with
 * `logger.child({ correlationId })` (see `createRequestLogger`).
 */
export const REDACT_PATHS = [
  'password',
  '*.password',
  'passwordHash',
  '*.passwordHash',
  'token',
  '*.token',
  'totpSecret',
  '*.totpSecret',
  'secret',
  '*.secret',
  'authorization',
  'headers.authorization',
  'headers.cookie',
  'cookie',
  'req.headers.authorization',
  'req.headers.cookie',
];

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'test' ? 'silent' : 'info'),
  redact: { paths: REDACT_PATHS, censor: '[redacted]' },
  base: { service: 'dragon-games' },
});

/** A request-scoped child logger carrying the correlation id (NFR-7.1). */
export function createRequestLogger(correlationId: string) {
  return logger.child({ correlationId });
}
