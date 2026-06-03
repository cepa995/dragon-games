'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Root error boundary. Reports the error to Sentry (PII-scrubbed via beforeSend)
 * and shows a minimal recovery UI. Replaced/expanded with localized styling in
 * later milestones; kept dependency-light so it renders even if the app shell
 * fails.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="sr">
      <body
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#1a1625',
          color: '#f5f3f7',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Došlo je do greške</h1>
        <p style={{ maxWidth: '40ch', opacity: 0.8 }}>
          Nešto je pošlo naopako. Pokušajte ponovo — ako se nastavi, kontaktirajte nas.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid #f5f3f7',
            background: 'transparent',
            color: '#f5f3f7',
            cursor: 'pointer',
          }}
        >
          Pokušaj ponovo
        </button>
      </body>
    </html>
  );
}
