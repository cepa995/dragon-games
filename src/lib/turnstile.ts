/**
 * Cloudflare Turnstile verification (SRS anti-spam). When no secret is
 * configured (local dev / CI) verification is skipped — the honeypot and per-IP
 * rate limit still apply — so forms remain testable without external services.
 * Set TURNSTILE_SECRET_KEY (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY) to enable it.
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export function turnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
