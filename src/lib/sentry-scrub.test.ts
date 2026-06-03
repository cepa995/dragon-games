import { describe, expect, it } from 'vitest';
import { scrubEvent, type ScrubbableEvent } from './sentry-scrub';

describe('scrubEvent', () => {
  it('removes request credentials, query and body', () => {
    const event: ScrubbableEvent = {
      request: {
        cookies: { session: 'abc' },
        query_string: 'token=secret',
        data: { password: 'hunter2' },
        headers: { Authorization: 'Bearer x', 'content-type': 'application/json' },
      },
    };

    scrubEvent(event);

    expect(event.request?.cookies).toBeUndefined();
    expect(event.request?.query_string).toBeUndefined();
    expect(event.request?.data).toBeUndefined();
    expect(event.request?.headers?.Authorization).toBeUndefined();
    // Non-sensitive headers are preserved.
    expect(event.request?.headers?.['content-type']).toBe('application/json');
  });

  it('strips user PII', () => {
    const event: ScrubbableEvent = {
      user: { id: 'u1', email: 'a@b.com', ip_address: '1.2.3.4', username: 'neo' },
    };

    scrubEvent(event);

    expect(event.user?.id).toBe('u1');
    expect(event.user?.email).toBeUndefined();
    expect(event.user?.ip_address).toBeUndefined();
    expect(event.user?.username).toBeUndefined();
  });

  it('redacts sensitive keys in extra and contexts', () => {
    const event: ScrubbableEvent = {
      extra: { password: 'p', note: 'ok' },
      contexts: { custom: { apiToken: 't', safe: 'v' } },
    };

    scrubEvent(event);

    expect(event.extra?.password).toBe('[redacted]');
    expect(event.extra?.note).toBe('ok');
    expect(event.contexts?.custom?.apiToken).toBe('[redacted]');
    expect(event.contexts?.custom?.safe).toBe('v');
  });
});
