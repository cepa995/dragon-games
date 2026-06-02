import type { Metadata, Viewport } from 'next';
import { WebVitals } from './_components/web-vitals';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Dragon Games',
    template: '%s · Dragon Games',
  },
  description: 'Dragon Games — TCG i board games klub i prodavnica u Novom Sadu od 1994.',
};

export const viewport: Viewport = {
  themeColor: '#1a1625',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Locale-prefixed routing (`/sr`, `/en`) and the <html lang> wiring are
  // finalised in M2 (#10, next-intl). Default to Serbian for the foundation.
  return (
    <html lang="sr">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
