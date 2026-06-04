import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/request', () => ({ getClientIp: vi.fn(async () => '1.2.3.4') }));
vi.mock('@/lib/auth/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ ok: true, remaining: 2, retryAfterMs: 0 })),
}));
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile: vi.fn(async () => true) }));
vi.mock('@/lib/contact', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./contact')>();
  return { ...actual, submitContactMessage: vi.fn(async () => ({ id: 'x' })) };
});

import { rateLimit } from '@/lib/auth/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { submitContactMessage } from './contact';
import { contactSubmitAction } from './contact-actions';

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

const valid = {
  name: 'Marko Marković',
  email: 'marko@example.com',
  subject: 'Pitanje o turniru',
  message: 'Zdravo, imam pitanje o nedeljnom turniru.',
};

describe('contactSubmitAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rateLimit).mockReturnValue({ ok: true, remaining: 2, retryAfterMs: 0 });
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
  });

  it('stores a valid submission and returns success', async () => {
    const res = await contactSubmitAction({}, fd(valid));
    expect(res).toEqual({ success: true });
    expect(submitContactMessage).toHaveBeenCalledOnce();
  });

  it('rejects an invalid email', async () => {
    const res = await contactSubmitAction({}, fd({ ...valid, email: 'not-an-email' }));
    expect(res).toEqual({ error: 'invalid' });
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('rejects a too-short message', async () => {
    const res = await contactSubmitAction({}, fd({ ...valid, message: 'hi' }));
    expect(res).toEqual({ error: 'invalid' });
  });

  it('silently drops honeypot hits without storing', async () => {
    const res = await contactSubmitAction({}, fd({ ...valid, company: 'bot-filled' }));
    expect(res).toEqual({ success: true });
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('rejects when over the rate limit', async () => {
    vi.mocked(rateLimit).mockReturnValue({ ok: false, remaining: 0, retryAfterMs: 1000 });
    const res = await contactSubmitAction({}, fd(valid));
    expect(res).toEqual({ error: 'rate' });
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('rejects when the anti-spam check fails', async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(false);
    const res = await contactSubmitAction({}, fd(valid));
    expect(res).toEqual({ error: 'spam' });
    expect(submitContactMessage).not.toHaveBeenCalled();
  });
});
