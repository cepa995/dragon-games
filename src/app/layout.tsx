import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { fontVariables } from '@/lib/fonts';
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
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Locale-prefixed routing and the <html lang> per-locale value are finalised in
  // M2 (#10, next-intl). `suppressHydrationWarning` is required by next-themes
  // (the pre-paint script sets data-theme before React hydrates).
  return (
    <html lang="sr" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <WebVitals />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
