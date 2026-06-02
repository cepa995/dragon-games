import pino from 'pino';
import { describe, expect, it } from 'vitest';
import { REDACT_PATHS } from './logger';

/** Capture a single JSON log line written with the app's redaction config. */
function logAndCapture(obj: Record<string, unknown>): Record<string, unknown> {
  const lines: string[] = [];
  const log = pino(
    { redact: { paths: REDACT_PATHS, censor: '[redacted]' } },
    { write: (s: string) => lines.push(s) },
  );
  log.info(obj, 'test');
  return JSON.parse(lines.join('')) as Record<string, unknown>;
}

describe('logger redaction', () => {
  it('redacts top-level secrets', () => {
    const out = logAndCapture({ password: 'hunter2', passwordHash: 'x', keep: 'visible' });
    expect(out.password).toBe('[redacted]');
    expect(out.passwordHash).toBe('[redacted]');
    expect(out.keep).toBe('visible');
  });

  it('redacts nested secrets and auth headers', () => {
    const out = logAndCapture({
      user: { token: 'abc', totpSecret: 's' },
      headers: { authorization: 'Bearer x', cookie: 'a=b' },
    });
    const user = out.user as Record<string, unknown>;
    const headers = out.headers as Record<string, unknown>;
    expect(user.token).toBe('[redacted]');
    expect(user.totpSecret).toBe('[redacted]');
    expect(headers.authorization).toBe('[redacted]');
    expect(headers.cookie).toBe('[redacted]');
  });
});
