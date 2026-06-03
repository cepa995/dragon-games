import type { EmailMessage } from './send';

type Locale = 'sr' | 'en';

const copy = {
  verify: {
    sr: {
      subject: 'Potvrdite svoju email adresu — Dragon Games',
      heading: 'Potvrda email adrese',
      body: 'Kliknite na dugme ispod da potvrdite svoju email adresu.',
      cta: 'Potvrdi email',
      ignore: 'Ako niste vi kreirali nalog, ignorišite ovu poruku.',
    },
    en: {
      subject: 'Confirm your email — Dragon Games',
      heading: 'Confirm your email',
      body: 'Click the button below to confirm your email address.',
      cta: 'Confirm email',
      ignore: 'If you did not create an account, you can ignore this email.',
    },
  },
  reset: {
    sr: {
      subject: 'Resetovanje lozinke — Dragon Games',
      heading: 'Resetovanje lozinke',
      body: 'Zatražili ste resetovanje lozinke. Link važi 1 sat.',
      cta: 'Resetuj lozinku',
      ignore: 'Ako niste vi, ignorišite ovu poruku — vaša lozinka ostaje nepromenjena.',
    },
    en: {
      subject: 'Reset your password — Dragon Games',
      heading: 'Reset your password',
      body: 'You requested a password reset. This link is valid for 1 hour.',
      cta: 'Reset password',
      ignore: 'If this was not you, ignore this email — your password stays unchanged.',
    },
  },
  magic: {
    sr: {
      subject: 'Vaš link za prijavu — Dragon Games',
      heading: 'Prijava na Dragon Games',
      body: 'Kliknite na dugme da se prijavite. Link važi 24 sata.',
      cta: 'Prijavi se',
      ignore: 'Ako niste vi zatražili prijavu, ignorišite ovu poruku.',
    },
    en: {
      subject: 'Your sign-in link — Dragon Games',
      heading: 'Sign in to Dragon Games',
      body: 'Click the button to sign in. This link is valid for 24 hours.',
      cta: 'Sign in',
      ignore: 'If you did not request this, you can ignore this email.',
    },
  },
} as const;

function layout(c: { heading: string; body: string; cta: string; ignore: string }, url: string) {
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;background:#1a1625;color:#f5f3f7;padding:24px">
  <div style="max-width:480px;margin:0 auto">
    <h1 style="font-size:20px">${c.heading}</h1>
    <p style="color:#cfc9d6">${c.body}</p>
    <p><a href="${url}" style="display:inline-block;background:#d99a3a;color:#1a1625;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${c.cta}</a></p>
    <p style="font-size:12px;color:#9a93a6">${c.ignore}</p>
    <p style="font-size:12px;color:#9a93a6;word-break:break-all">${url}</p>
  </div></body></html>`;
  const text = `${c.heading}\n\n${c.body}\n\n${c.cta}: ${url}\n\n${c.ignore}`;
  return { html, text };
}

export function verificationEmail(to: string, url: string, locale: Locale): EmailMessage {
  const c = copy.verify[locale];
  return { to, subject: c.subject, ...layout(c, url) };
}

export function passwordResetEmail(to: string, url: string, locale: Locale): EmailMessage {
  const c = copy.reset[locale];
  return { to, subject: c.subject, ...layout(c, url) };
}

export function magicLinkEmail(to: string, url: string, locale: Locale): EmailMessage {
  const c = copy.magic[locale];
  return { to, subject: c.subject, ...layout(c, url) };
}
