/**
 * PII scrubbing for Sentry events (NFR-6.5). Kept as a pure function so it can be
 * unit-tested in isolation and reused by every Sentry runtime (client / server /
 * edge). Removes request credentials, user identifiers, and obviously sensitive
 * keys before any event leaves the process.
 */

// Structural subset of a Sentry event — avoids coupling tests to SDK types.
export interface ScrubbableEvent {
  request?: {
    cookies?: unknown;
    headers?: Record<string, unknown>;
    query_string?: unknown;
    data?: unknown;
  };
  user?: Record<string, unknown>;
  extra?: Record<string, unknown>;
  contexts?: Record<string, Record<string, unknown> | undefined>;
  [key: string]: unknown;
}

const SENSITIVE_KEY = /pass(word)?|secret|token|authorization|cookie|totp|^email$|ssn|card/i;

function scrubObject<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_KEY.test(key)) {
      obj[key as keyof T] = '[redacted]' as T[keyof T];
    }
  }
  return obj;
}

export function scrubEvent<T extends ScrubbableEvent>(event: T): T {
  if (event.request) {
    // Drop request credentials and raw query/body entirely.
    delete event.request.cookies;
    delete event.request.query_string;
    delete event.request.data;
    if (event.request.headers) {
      for (const header of Object.keys(event.request.headers)) {
        if (SENSITIVE_KEY.test(header)) {
          delete event.request.headers[header];
        }
      }
    }
  }

  // Never report user PII — keep only a coarse, non-identifying shape if present.
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
  }

  if (event.extra) scrubObject(event.extra);

  if (event.contexts) {
    for (const ctx of Object.values(event.contexts)) {
      if (ctx) scrubObject(ctx);
    }
  }

  return event;
}
